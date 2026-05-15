#!/bin/sh

set -eu

REPO_URL="${WANDESK_REPO_URL:-https://github.com/Sider-ai/wandesk.git}"
REPO_REF="${WANDESK_REPO_REF:-main}"
INSTALL_ROOT="${WANDESK_INSTALL_ROOT:-$HOME/.wandesk}"
REPO_DIR="$INSTALL_ROOT/repo"
APP_DIR="$REPO_DIR"
LOG_DIR="$INSTALL_ROOT/logs"
RUN_DIR="$INSTALL_ROOT/run"
SERVER_LOG="$LOG_DIR/server.log"
APPS_LOG="$LOG_DIR/apps.log"
SERVER_PID_FILE="$RUN_DIR/server.pid"
APPS_PID_FILE="$RUN_DIR/apps.pid"
SERVER_PORT="${WANDESK_SERVER_PORT:-9502}"
APPS_PORT="${WANDESK_APPS_PORT:-9503}"

log() {
  printf '%s\n' "$*"
}

fail() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "Missing required command: $1"
  fi
}

check_macos() {
  os_name="$(uname -s 2>/dev/null || true)"
  [ "$os_name" = "Darwin" ] || fail "This installer is for macOS only."
}

check_node() {
  node_version="$(node -v 2>/dev/null || true)"
  [ -n "$node_version" ] || fail "Failed to read Node.js version."
  node_major="$(printf '%s' "$node_version" | sed 's/^v//' | cut -d. -f1)"
  case "$node_major" in
    ''|*[!0-9]*)
      fail "Unable to parse Node.js version: $node_version"
      ;;
  esac
  if [ "$node_major" -lt 20 ]; then
    fail "Node.js 20 or newer is required. Current version: $node_version"
  fi
}

ensure_dirs() {
  mkdir -p "$INSTALL_ROOT" "$LOG_DIR" "$RUN_DIR"
}

update_repo() {
  if [ -d "$REPO_DIR/.git" ]; then
    log "Updating repository in $REPO_DIR"
    git -C "$REPO_DIR" fetch origin "$REPO_REF"
    git -C "$REPO_DIR" checkout "$REPO_REF"
    git -C "$REPO_DIR" pull --ff-only origin "$REPO_REF"
  else
    log "Cloning repository into $REPO_DIR"
    git clone --branch "$REPO_REF" --depth 1 "$REPO_URL" "$REPO_DIR"
  fi
  [ -f "$APP_DIR/package.json" ] || fail "Wandesk app directory not found: $APP_DIR"
}

port_in_use() {
  port="$1"
  if command -v lsof >/dev/null 2>&1; then
    if lsof -n -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

stop_pid_file() {
  pid_file="$1"
  name="$2"
  if [ ! -f "$pid_file" ]; then
    return 0
  fi
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1; then
    log "Stopping previous $name process ($pid)"
    kill "$pid" >/dev/null 2>&1 || true
    sleep 1
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
  fi
  rm -f "$pid_file"
}

verify_ports_free() {
  if port_in_use "$SERVER_PORT"; then
    fail "Port $SERVER_PORT is already in use. Stop the existing process and retry."
  fi
  if port_in_use "$APPS_PORT"; then
    fail "Port $APPS_PORT is already in use. Stop the existing process and retry."
  fi
}

install_dependencies() {
  log "Installing npm dependencies"
  (
    cd "$APP_DIR"
    npm install
  )
}

build_app() {
  log "Building UI"
  (
    cd "$APP_DIR"
    npm run build
  )
}

start_services() {
  log "Starting Wandesk server"
  (
    cd "$APP_DIR"
    nohup npm run start >"$SERVER_LOG" 2>&1 &
    printf '%s' "$!" >"$SERVER_PID_FILE"
  )

  log "Starting Wandesk apps service"
  (
    cd "$APP_DIR"
    nohup npm run start:apps >"$APPS_LOG" 2>&1 &
    printf '%s' "$!" >"$APPS_PID_FILE"
  )
}

wait_for_http() {
  url="$1"
  name="$2"
  attempts=30
  i=0
  while [ "$i" -lt "$attempts" ]; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      return 0
    fi
    i=$((i + 1))
    sleep 1
  done
  log "$name failed health check."
  return 1
}

print_failure_logs() {
  if [ -f "$SERVER_LOG" ]; then
    log "--- server.log ---"
    tail -n 40 "$SERVER_LOG" || true
  fi
  if [ -f "$APPS_LOG" ]; then
    log "--- apps.log ---"
    tail -n 40 "$APPS_LOG" || true
  fi
}

main() {
  check_macos
  require_command curl
  require_command git
  require_command node
  require_command npm
  check_node
  ensure_dirs
  update_repo
  install_dependencies
  build_app
  stop_pid_file "$SERVER_PID_FILE" "server"
  stop_pid_file "$APPS_PID_FILE" "apps"
  verify_ports_free
  start_services
  if ! wait_for_http "http://127.0.0.1:$SERVER_PORT/api/health" "Wandesk server"; then
    print_failure_logs
    fail "Server did not become healthy."
  fi
  if ! wait_for_http "http://127.0.0.1:$APPS_PORT/apps/health" "Wandesk apps service"; then
    print_failure_logs
    fail "Apps service did not become healthy."
  fi
  log ""
  log "Wandesk installed successfully."
  log "Open: http://localhost:$SERVER_PORT"
  log "Repo: $REPO_DIR"
  log "Logs: $LOG_DIR"
}

main "$@"
