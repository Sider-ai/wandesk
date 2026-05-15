$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$RepoUrl = if ($env:WANDESK_REPO_URL) { $env:WANDESK_REPO_URL } else { "https://github.com/Sider-ai/wandesk.git" }
$RepoRef = if ($env:WANDESK_REPO_REF) { $env:WANDESK_REPO_REF } else { "main" }
$InstallRoot = if ($env:WANDESK_INSTALL_ROOT) { $env:WANDESK_INSTALL_ROOT } else { Join-Path $HOME ".wandesk" }
$RepoDir = Join-Path $InstallRoot "repo"
$AppDir = $RepoDir
$LogDir = Join-Path $InstallRoot "logs"
$RunDir = Join-Path $InstallRoot "run"
$ServerLog = Join-Path $LogDir "server.log"
$AppsLog = Join-Path $LogDir "apps.log"
$ServerPidFile = Join-Path $RunDir "server.pid"
$AppsPidFile = Join-Path $RunDir "apps.pid"
$ServerPort = if ($env:WANDESK_SERVER_PORT) { [int]$env:WANDESK_SERVER_PORT } else { 9502 }
$AppsPort = if ($env:WANDESK_APPS_PORT) { [int]$env:WANDESK_APPS_PORT } else { 9503 }

function Write-Info([string]$Message) {
  Write-Host $Message
}

function Fail([string]$Message) {
  throw $Message
}

function Require-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    Fail "Missing required command: $Name"
  }
}

function Assert-Windows {
  if (-not ($env:OS -eq "Windows_NT")) {
    Fail "This installer is for Windows only."
  }
}

function Assert-NodeVersion {
  $nodeVersion = (& node -v).Trim()
  if (-not $nodeVersion) {
    Fail "Failed to read Node.js version."
  }
  $majorPart = ($nodeVersion -replace "^v", "").Split(".")[0]
  $majorVersion = 0
  if (-not [int]::TryParse($majorPart, [ref]$majorVersion)) {
    Fail "Unable to parse Node.js version: $nodeVersion"
  }
  if ($majorVersion -lt 20) {
    Fail "Node.js 20 or newer is required. Current version: $nodeVersion"
  }
}

function Ensure-Dirs {
  New-Item -ItemType Directory -Force -Path $InstallRoot, $LogDir, $RunDir | Out-Null
}

function Update-Repo {
  if (Test-Path (Join-Path $RepoDir ".git")) {
    Write-Info "Updating repository in $RepoDir"
    & git -C $RepoDir fetch origin $RepoRef
    & git -C $RepoDir checkout $RepoRef
    & git -C $RepoDir pull --ff-only origin $RepoRef
  } else {
    Write-Info "Cloning repository into $RepoDir"
    & git clone --branch $RepoRef --depth 1 $RepoUrl $RepoDir
  }
  if (-not (Test-Path (Join-Path $AppDir "package.json"))) {
    Fail "Wandesk app directory not found: $AppDir"
  }
}

function Stop-PreviousProcess([string]$PidFile, [string]$Name) {
  if (-not (Test-Path $PidFile)) {
    return
  }
  $rawPid = (Get-Content -Path $PidFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
  if ($rawPid) {
    $proc = Get-Process -Id ([int]$rawPid) -ErrorAction SilentlyContinue
    if ($proc) {
      Write-Info "Stopping previous $Name process ($rawPid)"
      Stop-Process -Id ([int]$rawPid) -Force -ErrorAction SilentlyContinue
      Start-Sleep -Seconds 1
    }
  }
  Remove-Item -Force -ErrorAction SilentlyContinue $PidFile
}

function Test-PortInUse([int]$Port) {
  $listener = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
  return $null -ne $listener
}

function Assert-PortsFree {
  if (Test-PortInUse $ServerPort) {
    Fail "Port $ServerPort is already in use. Stop the existing process and retry."
  }
  if (Test-PortInUse $AppsPort) {
    Fail "Port $AppsPort is already in use. Stop the existing process and retry."
  }
}

function Install-Dependencies {
  Write-Info "Installing npm dependencies"
  Push-Location $AppDir
  try {
    & npm install
  } finally {
    Pop-Location
  }
}

function Build-App {
  Write-Info "Building UI"
  Push-Location $AppDir
  try {
    & npm run build
  } finally {
    Pop-Location
  }
}

function Start-ServiceProcess([string]$Command, [string]$LogFile, [string]$PidFile, [string]$Name) {
  Write-Info "Starting $Name"
  $escapedAppDir = $AppDir.Replace('"', '\"')
  $escapedLogFile = $LogFile.Replace('"', '\"')
  $cmdArgs = "/c cd /d ""$escapedAppDir"" && $Command > ""$escapedLogFile"" 2>&1"
  $process = Start-Process -FilePath "cmd.exe" -ArgumentList $cmdArgs -WindowStyle Hidden -PassThru
  Set-Content -Path $PidFile -Value $process.Id -NoNewline
}

function Wait-ForHttp([string]$Url, [string]$Name) {
  for ($i = 0; $i -lt 30; $i++) {
    try {
      Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2 | Out-Null
      return
    } catch {
      Start-Sleep -Seconds 1
    }
  }
  Fail "$Name did not become healthy."
}

function Print-FailureLogs {
  if (Test-Path $ServerLog) {
    Write-Info "--- server.log ---"
    Get-Content -Path $ServerLog -Tail 40
  }
  if (Test-Path $AppsLog) {
    Write-Info "--- apps.log ---"
    Get-Content -Path $AppsLog -Tail 40
  }
}

try {
  Assert-Windows
  Require-Command "git"
  Require-Command "node"
  Require-Command "npm"
  Assert-NodeVersion
  Ensure-Dirs
  Update-Repo
  Install-Dependencies
  Build-App
  Stop-PreviousProcess -PidFile $ServerPidFile -Name "server"
  Stop-PreviousProcess -PidFile $AppsPidFile -Name "apps"
  Assert-PortsFree
  Start-ServiceProcess -Command "npm run start" -LogFile $ServerLog -PidFile $ServerPidFile -Name "Wandesk server"
  Start-ServiceProcess -Command "npm run start:apps" -LogFile $AppsLog -PidFile $AppsPidFile -Name "Wandesk apps service"
  Wait-ForHttp -Url "http://127.0.0.1:$ServerPort/api/health" -Name "Wandesk server"
  Wait-ForHttp -Url "http://127.0.0.1:$AppsPort/apps/health" -Name "Wandesk apps service"
  Write-Info ""
  Write-Info "Wandesk installed successfully."
  Write-Info "Open: http://localhost:$ServerPort"
  Write-Info "Repo: $RepoDir"
  Write-Info "Logs: $LogDir"
} catch {
  Print-FailureLogs
  Write-Error $_
  exit 1
}
