//! Sidecar process management for Wandesk.
//!
//! Handles spawning, health-checking, and cleanup of the two Node.js server processes.

use std::fs;
use std::path::Path;
use std::process::{Child, Command, Stdio};
use std::time::Duration;

/// Spawn a Node.js server process.
pub fn spawn_server(
    node_bin: &str,
    tsx_cli: &Path,
    entry: &Path,
    port: u16,
    cwd: &Path,
    env_vars: &std::collections::HashMap<String, String>,
) -> Result<Child, Box<dyn std::error::Error>> {
    let child = Command::new(node_bin)
        .arg(tsx_cli)
        .arg(entry)
        .arg(format!("--port={port}"))
        .current_dir(cwd)
        .envs(env_vars)
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    println!(
        "[sidecar] Spawned {} on port {} (PID: {:?})",
        entry.display(),
        port,
        child.id()
    );

    // Write PID file for crash recovery
    let pid_dir = dirs::data_dir()
        .unwrap_or_else(|| ".".into())
        .join("Wandesk")
        .join("pids");
    fs::create_dir_all(&pid_dir).ok();
    let pid_file = pid_dir.join(format!("{port}.pid"));
    fs::write(&pid_file, child.id().to_string()).ok();

    Ok(child)
}

/// Poll a health endpoint until it responds with 200 OK.
pub fn wait_for_health(
    url: &str,
    max_retries: u32,
    interval: Duration,
) -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::blocking::Client::builder()
        .timeout(Duration::from_secs(2))
        .build()?;

    for i in 0..max_retries {
        match client.get(url).send() {
            Ok(resp) if resp.status().is_success() => {
                println!("[sidecar] Health check passed after {} attempts", i + 1);
                return Ok(());
            }
            Ok(resp) => {
                println!(
                    "[sidecar] Health check returned {} (attempt {}/{})",
                    resp.status(),
                    i + 1,
                    max_retries
                );
            }
            Err(e) => {
                if i % 5 == 0 {
                    println!(
                        "[sidecar] Health check failed: {} (attempt {}/{})",
                        e, i + 1, max_retries
                    );
                }
            }
        }
        std::thread::sleep(interval);
    }

    Err(format!("Health check failed after {max_retries} attempts for {url}").into())
}

/// Gracefully kill a child process: SIGTERM → wait 5s → SIGKILL.
pub fn kill_process(child: &mut Child) {
    let pid = child.id();
    println!("[sidecar] Killing process {pid}");

    // Try graceful shutdown first
    #[cfg(unix)]
    {
        unsafe {
            libc::kill(pid as i32, libc::SIGTERM);
        }
    }
    #[cfg(windows)]
    {
        // On Windows, kill() sends SIGTERM equivalent
        let _ = child.kill();
    }

    // Wait up to 5 seconds for clean exit
    for _ in 0..50 {
        match child.try_wait() {
            Ok(Some(status)) => {
                println!("[sidecar] Process {pid} exited: {status}");
                cleanup_pid_file(pid);
                return;
            }
            Ok(None) => std::thread::sleep(Duration::from_millis(100)),
            Err(e) => {
                println!("[sidecar] Error checking process {pid}: {e}");
                return;
            }
        }
    }

    // Force kill
    println!("[sidecar] Force-killing process {pid}");
    let _ = child.kill();
    let _ = child.wait();
    cleanup_pid_file(pid);
}

/// Clean up orphaned processes from previous crashes by checking PID files.
pub fn cleanup_orphans(main_port: u16, apps_port: u16) {
    let pid_dir = dirs::data_dir()
        .unwrap_or_else(|| ".".into())
        .join("Wandesk")
        .join("pids");

    if !pid_dir.exists() {
        return;
    }

    for port in [main_port, apps_port] {
        let pid_file = pid_dir.join(format!("{port}.pid"));
        if let Ok(pid_str) = fs::read_to_string(&pid_file) {
            if let Ok(pid) = pid_str.trim().parse::<u32>() {
                println!("[sidecar] Found orphan PID {pid} for port {port}, attempting cleanup");
                kill_process_by_pid(pid);
            }
        }
        let _ = fs::remove_file(&pid_file);
    }

    // Also try to kill any process holding the ports directly
    #[cfg(unix)]
    {
        for port in [main_port, apps_port] {
            kill_process_on_port(port);
        }
    }
}

/// Kill a process by PID (cross-platform).
fn kill_process_by_pid(pid: u32) {
    #[cfg(unix)]
    {
        unsafe {
            // Check if process exists first
            if libc::kill(pid as i32, 0) == 0 {
                libc::kill(pid as i32, libc::SIGTERM);
                std::thread::sleep(Duration::from_millis(500));
                // Check if still alive
                if libc::kill(pid as i32, 0) == 0 {
                    libc::kill(pid as i32, libc::SIGKILL);
                }
            }
        }
    }
    #[cfg(windows)]
    {
        let _ = Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/F"])
            .output();
    }
}

/// Kill any process listening on a given port (macOS/Linux only).
#[cfg(unix)]
fn kill_process_on_port(port: u16) {
    // Try lsof first (macOS/Linux)
    if let Ok(output) = Command::new("lsof")
        .args(["-ti", &format!(":{}", port)])
        .output()
    {
        let pids = String::from_utf8_lossy(&output.stdout);
        for pid_str in pids.lines() {
            if let Ok(pid) = pid_str.trim().parse::<u32>() {
                println!("[sidecar] Killing process {pid} on port {port}");
                kill_process_by_pid(pid);
            }
        }
    }
}

/// Remove the PID file for a given process.
fn cleanup_pid_file(pid: u32) {
    let pid_dir = dirs::data_dir()
        .unwrap_or_else(|| ".".into())
        .join("Wandesk")
        .join("pids");

    if let Ok(entries) = fs::read_dir(&pid_dir) {
        for entry in entries.flatten() {
            if let Ok(content) = fs::read_to_string(entry.path()) {
                if content.trim() == pid.to_string() {
                    let _ = fs::remove_file(entry.path());
                }
            }
        }
    }
}

/// Enhance PATH for spawned Node.js processes.
/// On macOS, GUI apps launched from Dock have a minimal PATH.
/// This adds common locations for developer tools (homebrew, npm, etc.).
pub fn enhance_path(env_vars: &mut std::collections::HashMap<String, String>) {
    let current_path = env_vars.get("PATH").cloned().unwrap_or_default();

    #[cfg(target_os = "macos")]
    {
        let extra_dirs = [
            "/opt/homebrew/bin",
            "/usr/local/bin",
            &format!(
                "{}/.claude/local",
                dirs::home_dir().unwrap_or_default().display()
            ),
            &format!(
                "{}/.local/bin",
                dirs::home_dir().unwrap_or_default().display()
            ),
            &format!(
                "{}/.npm-global/bin",
                dirs::home_dir().unwrap_or_default().display()
            ),
        ];

        let mut parts: Vec<&str> = current_path.split(':').collect();
        for dir in extra_dirs {
            if !parts.contains(&dir) && Path::new(dir).exists() {
                parts.push(dir);
            }
        }
        env_vars.insert("PATH".into(), parts.join(":"));
    }

    #[cfg(target_os = "linux")]
    {
        let extra_dirs = [
            "/usr/local/bin",
            &format!(
                "{}/.local/bin",
                dirs::home_dir().unwrap_or_default().display()
            ),
            &format!(
                "{}/.npm-global/bin",
                dirs::home_dir().unwrap_or_default().display()
            ),
        ];

        let mut parts: Vec<&str> = current_path.split(':').collect();
        for dir in extra_dirs {
            if !parts.contains(&dir) && Path::new(dir).exists() {
                parts.push(dir);
            }
        }
        env_vars.insert("PATH".into(), parts.join(":"));
    }

    #[cfg(target_os = "windows")]
    {
        let home = dirs::home_dir().unwrap_or_default();
        let extra_dirs = [
            home.join("AppData").join("Roaming").join("npm"),
            home.join(".claude").join("local"),
        ];

        let mut parts: Vec<&str> = current_path.split(';').collect();
        for dir in &extra_dirs {
            let dir_str = dir.to_string_lossy();
            if !parts.contains(&dir_str.as_ref()) && dir.exists() {
                parts.push(dir_str.as_ref());
            }
        }
        env_vars.insert("PATH".into(), parts.join(";"));
    }
}
