use std::{
    io,
    process::Stdio,
    sync::Mutex,
    thread,
    time::{Duration, Instant},
};

use reqwest::blocking::get;
use tauri::{AppHandle, Manager};

use crate::{
    shell::{
        shell_text,
        ui::{show_app_window, show_status_window},
    },
    state::ServiceState,
    workspace::{
        locale::{current_locale, ensure_settings_locale},
        paths::{
            app_log_dir, append_log, command_log_file, ensure_workspace, node_binary_path,
            reset_workspace_data, resource_root, workspace_dir, workspace_is_current,
        },
        subprocess::CommandExt as _,
    },
    AIOS_URL, APPS_PORT, MAIN_PORT,
};

pub(crate) fn main_service_ready() -> bool {
    get(format!("{AIOS_URL}/api/health"))
        .map(|response| response.status().is_success())
        .unwrap_or(false)
}

pub(crate) fn apps_service_ready() -> bool {
    get(format!("http://127.0.0.1:{APPS_PORT}/apps/health"))
        .map(|response| response.status().is_success())
        .unwrap_or(false)
}

pub(crate) fn service_is_ready() -> bool {
    main_service_ready() && apps_service_ready()
}

pub(crate) fn update_tray_status(app: &AppHandle) {
    let (_initializing, _has_main, _has_apps) = {
        let state_handle = app.state::<Mutex<ServiceState>>();
        let state = state_handle.lock().expect("service state poisoned");
        (
            state.initializing,
            state.main.is_some(),
            state.apps.is_some(),
        )
    };

    let _ = (main_service_ready(), apps_service_ready());
}

fn ensure_workspace_resources(workspace: &std::path::Path) -> io::Result<()> {
    let required_paths = [
        (
            workspace.join("node_modules"),
            "workspace node_modules missing",
        ),
        (
            tsx_cli_path(workspace),
            "workspace tsx CLI missing: node_modules/tsx/dist/cli.mjs",
        ),
        (
            workspace
                .join("node_modules")
                .join("vite")
                .join("bin")
                .join("vite.js"),
            "workspace Vite CLI missing: node_modules/vite/bin/vite.js",
        ),
        (
            tsc_cli_path(workspace),
            "workspace TypeScript CLI missing: node_modules/typescript/bin/tsc",
        ),
        (
            workspace.join("tsconfig.server.json"),
            "workspace server tsconfig missing: tsconfig.server.json",
        ),
        (
            workspace.join("scripts").join("start.ts"),
            "workspace start script missing: scripts/start.ts",
        ),
        (
            workspace.join("server").join("main").join("index.ts"),
            "workspace main service entry missing: server/main/index.ts",
        ),
        (
            workspace.join("server").join("apps").join("index.ts"),
            "workspace apps service entry missing: server/apps/index.ts",
        ),
    ];

    for (path, message) in required_paths {
        if !path.exists() {
            return Err(io::Error::other(format!("{message} ({})", path.display())));
        }
    }

    Ok(())
}

fn tsx_cli_path(workspace: &std::path::Path) -> std::path::PathBuf {
    workspace
        .join("node_modules")
        .join("tsx")
        .join("dist")
        .join("cli.mjs")
}

fn tsc_cli_path(workspace: &std::path::Path) -> std::path::PathBuf {
    workspace
        .join("node_modules")
        .join("typescript")
        .join("bin")
        .join("tsc")
}

fn run_tsx_script(
    app: &AppHandle,
    cwd: &std::path::Path,
    script_path: &std::path::Path,
    args: &[&str],
    log_name: &str,
    display_name: &str,
) -> io::Result<()> {
    let stdout = command_log_file(app, log_name)?;
    let stderr = stdout.try_clone()?;
    let node = node_binary_path(app);
    let tsx = tsx_cli_path(cwd);

    if !tsx.exists() {
        return Err(io::Error::other(format!(
            "tsx CLI missing: {}",
            tsx.display()
        )));
    }
    if !script_path.exists() {
        return Err(io::Error::other(format!(
            "{} missing: {}",
            display_name,
            script_path.display()
        )));
    }

    append_log(
        app,
        &format!(
            "running {} in {} (node={}, tsx={}, log={})",
            display_name,
            cwd.display(),
            node.display(),
            tsx.display(),
            app_log_dir(app).join(log_name).display()
        ),
    );

    let status = std::process::Command::new(&node)
        .no_window()
        .arg(tsx)
        .arg(script_path)
        .args(args)
        .current_dir(cwd)
        .stdin(Stdio::null())
        .stdout(Stdio::from(stdout))
        .stderr(Stdio::from(stderr))
        .status()?;

    if status.success() {
        append_log(app, &format!("{} completed", display_name));
        Ok(())
    } else {
        Err(io::Error::other(format!("{} failed", display_name)))
    }
}

// 这里统一封装 Node 子进程执行，避免启动、构建、语言脚本各自重复拼命令。
fn run_node_script(
    app: &AppHandle,
    cwd: &std::path::Path,
    script_path: &std::path::Path,
    args: &[&str],
    log_name: &str,
    display_name: &str,
) -> io::Result<()> {
    let stdout = command_log_file(app, log_name)?;
    let stderr = stdout.try_clone()?;
    let node = node_binary_path(app);

    if !script_path.exists() {
        return Err(io::Error::other(format!(
            "{} missing: {}",
            display_name,
            script_path.display()
        )));
    }

    append_log(
        app,
        &format!(
            "running {} in {} (node={}, log={})",
            display_name,
            cwd.display(),
            node.display(),
            app_log_dir(app).join(log_name).display()
        ),
    );

    let status = std::process::Command::new(&node)
        .no_window()
        .arg(script_path)
        .args(args)
        .current_dir(cwd)
        .stdin(Stdio::null())
        .stdout(Stdio::from(stdout))
        .stderr(Stdio::from(stderr))
        .status()?;

    if status.success() {
        append_log(app, &format!("{} completed", display_name));
        Ok(())
    } else {
        Err(io::Error::other(format!("{} failed", display_name)))
    }
}

fn log_child_exit_if_any(
    app: &AppHandle,
    label: &str,
    child: &mut std::process::Child,
    already_logged: &mut bool,
) {
    if *already_logged {
        return;
    }

    match child.try_wait() {
        Ok(Some(status)) => {
            *already_logged = true;
            append_log(
                app,
                &format!("{label} service exited before health check passed: {status}"),
            );
        }
        Ok(None) => {}
        Err(err) => {
            *already_logged = true;
            append_log(
                app,
                &format!("failed to inspect {label} service during health check: {err}"),
            );
        }
    }
}

fn wait_for_health(app: &AppHandle) -> bool {
    let start = Instant::now();
    let mut last_progress_log = 0;
    let mut main_exit_logged = false;
    let mut apps_exit_logged = false;

    while start.elapsed() < Duration::from_secs(60) {
        let main_ready = main_service_ready();
        let apps_ready = apps_service_ready();
        if main_ready && apps_ready {
            return true;
        }

        let elapsed = start.elapsed().as_secs();
        if elapsed == 0 || elapsed.saturating_sub(last_progress_log) >= 5 {
            last_progress_log = elapsed;
            append_log(
                app,
                &format!(
                    "waiting for health check: elapsed={}s main_ready={} apps_ready={}",
                    elapsed, main_ready, apps_ready
                ),
            );
        }

        {
            let state_handle = app.state::<Mutex<ServiceState>>();
            let mut state = state_handle.lock().expect("service state poisoned");
            if let Some(child) = state.main.as_mut() {
                log_child_exit_if_any(app, "main", child, &mut main_exit_logged);
            }
            if let Some(child) = state.apps.as_mut() {
                log_child_exit_if_any(app, "apps", child, &mut apps_exit_logged);
            }
        }

        thread::sleep(Duration::from_millis(500));
    }

    append_log(
        app,
        &format!(
            "health check timed out after 60s: main_ready={} apps_ready={}",
            main_service_ready(),
            apps_service_ready()
        ),
    );
    false
}

#[cfg(not(windows))]
fn kill_processes_on_port(app: &AppHandle, port: u16) {
    let output = std::process::Command::new("lsof")
        .args(["-ti", &format!("tcp:{port}"), "-sTCP:LISTEN"])
        .output();

    let Ok(output) = output else {
        append_log(app, &format!("failed to inspect port {port} with lsof"));
        return;
    };

    let pids = String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(str::trim)
        .filter(|line| !line.is_empty())
        .map(ToOwned::to_owned)
        .collect::<Vec<_>>();

    for pid in pids {
        let _ = std::process::Command::new("kill")
            .args(["-TERM", &pid])
            .status();
        thread::sleep(Duration::from_millis(150));
        let _ = std::process::Command::new("kill")
            .args(["-KILL", &pid])
            .status();
        append_log(app, &format!("killed stale pid {pid} on port {port}"));
    }
}

#[cfg(windows)]
fn kill_processes_on_port(app: &AppHandle, port: u16) {
    let output = std::process::Command::new("netstat")
        .no_window()
        .args(["-ano", "-p", "tcp"])
        .output();

    let Ok(output) = output else {
        append_log(app, &format!("failed to inspect port {port} with netstat"));
        return;
    };

    let pids = String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| netstat_listening_pid(line, port))
        .collect::<std::collections::BTreeSet<_>>();

    for pid in pids {
        let status = std::process::Command::new("taskkill")
            .no_window()
            .args(["/PID", &pid, "/T", "/F"])
            .status();
        match status {
            Ok(status) if status.success() => {
                append_log(app, &format!("killed stale pid {pid} on port {port}"));
            }
            _ => {
                append_log(
                    app,
                    &format!("failed to kill stale pid {pid} on port {port}"),
                );
            }
        }
    }
}

#[cfg(windows)]
fn netstat_listening_pid(line: &str, port: u16) -> Option<String> {
    let mut parts = line.split_whitespace();
    let protocol = parts.next()?;
    if !protocol.eq_ignore_ascii_case("TCP") {
        return None;
    }
    let local_address = parts.next()?;
    let _remote_address = parts.next()?;
    let state = parts.next()?;
    let pid = parts.next()?;

    if !state.eq_ignore_ascii_case("LISTENING") {
        return None;
    }
    if !local_address.ends_with(&format!(":{port}")) {
        return None;
    }
    if !pid.chars().all(|ch| ch.is_ascii_digit()) {
        return None;
    }
    Some(pid.to_string())
}

pub(crate) fn stop_any_running_services(app: &AppHandle) {
    stop_services(app);
    kill_processes_on_port(app, MAIN_PORT);
    kill_processes_on_port(app, APPS_PORT);
}

pub(crate) fn stop_services(app: &AppHandle) {
    let state_handle = app.state::<Mutex<ServiceState>>();
    let mut state = state_handle.lock().expect("service state poisoned");
    if let Some(child) = state.main.as_mut() {
        let _ = child.kill();
        let _ = child.wait();
    }
    if let Some(child) = state.apps.as_mut() {
        let _ = child.kill();
        let _ = child.wait();
    }
    state.main = None;
    state.apps = None;
    state.initializing = false;
    append_log(app, "services stopped");
    drop(state);
    update_tray_status(app);
}

pub(crate) fn restart_services(app: AppHandle) {
    stop_any_running_services(&app);
    start_services(app, false);
}

#[tauri::command]
pub(crate) fn reset_local_data_command(app: AppHandle) -> Result<(), String> {
    stop_any_running_services(&app);
    reset_workspace_data(&app).map_err(|err| err.to_string())?;
    start_services(app, true);
    Ok(())
}

// 启动状态比较多，这里先做一次“是否需要真正启动”的快速短路，避免线程里再套一层分支。
fn mark_initializing_or_show_existing(app: &AppHandle) -> bool {
    let text = shell_text();
    let state_handle = app.state::<Mutex<ServiceState>>();
    let mut state = state_handle.lock().expect("service state poisoned");
    if state.initializing {
        show_status_window(app, text.starting_title, text.starting_in_progress);
        return false;
    }
    if state.main.is_some() || state.apps.is_some() {
        drop(state);
        update_tray_status(app);
        show_status_window(app, text.starting_title, text.starting_waiting);
        return false;
    }
    state.initializing = true;
    true
}

// 启动前的准备都放在这里：workspace、语言覆盖、前端构建。
fn prepare_workspace(app: &AppHandle) -> io::Result<std::path::PathBuf> {
    append_log(
        app,
        &format!(
            "service initialization started (logs={}, data={}, resources={})",
            app_log_dir(app).display(),
            workspace_dir(app)
                .parent()
                .map(|path| path.display().to_string())
                .unwrap_or_else(|| "<missing parent>".to_string()),
            resource_root(app).display()
        ),
    );
    let workspace = ensure_workspace(app)?;
    append_log(app, &format!("workspace ready: {}", workspace.display()));
    ensure_workspace_resources(&workspace)?;

    let text = shell_text();

    let locale =
        ensure_settings_locale(&workspace).unwrap_or_else(|_| current_locale().to_string());
    append_log(app, &format!("baking locale: {locale}"));

    show_status_window(app, text.starting_title, text.starting_building);

    let start_script = workspace.join("scripts").join("start.ts");
    if start_script.exists() {
        run_tsx_script(
            app,
            &workspace,
            &start_script,
            &[locale.as_str(), "--force"],
            "aios-start.log",
            "aios start.ts",
        )?;
    }

    run_node_script(
        app,
        &workspace,
        &workspace
            .join("node_modules")
            .join("vite")
            .join("bin")
            .join("vite.js"),
        &["build", "--config", "gui/vite.config.ts", "gui"],
        "vite-build.log",
        "vite build",
    )?;

    let gui_dist_entry = workspace.join("gui").join("dist").join("index.html");
    if !gui_dist_entry.exists() {
        return Err(io::Error::other(format!(
            "workspace gui dist missing: gui/dist/index.html ({})",
            gui_dist_entry.display()
        )));
    }

    run_node_script(
        app,
        &workspace,
        &tsc_cli_path(&workspace),
        &["-p", "tsconfig.server.json"],
        "server-build.log",
        "server build",
    )?;

    for (entry_path, label) in [
        (
            workspace
                .join("dist")
                .join("server")
                .join("main")
                .join("index.js"),
            "compiled main service entry",
        ),
        (
            workspace
                .join("dist")
                .join("server")
                .join("apps")
                .join("index.js"),
            "compiled apps service entry",
        ),
    ] {
        if !entry_path.exists() {
            return Err(io::Error::other(format!(
                "{label} missing: {}",
                entry_path.display()
            )));
        }
    }

    Ok(workspace)
}

fn spawn_main_process(
    app: &AppHandle,
    workspace: &std::path::Path,
) -> io::Result<std::process::Child> {
    let node = node_binary_path(app);
    let entry = workspace
        .join("dist")
        .join("server")
        .join("main")
        .join("index.js");
    let stdout = command_log_file(app, "server-main.log")?;
    let stderr = stdout.try_clone()?;
    append_log(
        app,
        &format!(
            "spawning main service: node={}, entry={}, port={}, log={}",
            node.display(),
            entry.display(),
            MAIN_PORT,
            app_log_dir(app).join("server-main.log").display()
        ),
    );
    let child = std::process::Command::new(&node)
        .no_window()
        .arg(entry)
        .arg(format!("--port={MAIN_PORT}"))
        .env("AIOS_SERVER_PORT", MAIN_PORT.to_string())
        .env("AIOS_PORT", MAIN_PORT.to_string())
        .env("AIOS_APPS_PORT", APPS_PORT.to_string())
        .current_dir(workspace)
        .stdin(Stdio::null())
        .stdout(Stdio::from(stdout))
        .stderr(Stdio::from(stderr))
        .spawn()?;
    append_log(app, &format!("main service spawned: pid={}", child.id()));
    Ok(child)
}

fn spawn_apps_process(
    app: &AppHandle,
    workspace: &std::path::Path,
) -> io::Result<std::process::Child> {
    let node = node_binary_path(app);
    let entry = workspace
        .join("dist")
        .join("server")
        .join("apps")
        .join("index.js");
    let stdout = command_log_file(app, "server-apps.log")?;
    let stderr = stdout.try_clone()?;
    append_log(
        app,
        &format!(
            "spawning apps service: node={}, entry={}, port={}, log={}",
            node.display(),
            entry.display(),
            APPS_PORT,
            app_log_dir(app).join("server-apps.log").display()
        ),
    );
    let child = std::process::Command::new(&node)
        .no_window()
        .arg(entry)
        .arg(format!("--port={APPS_PORT}"))
        .env("AIOS_SERVER_PORT", MAIN_PORT.to_string())
        .env("AIOS_PORT", MAIN_PORT.to_string())
        .env("AIOS_APPS_PORT", APPS_PORT.to_string())
        .current_dir(workspace)
        .stdin(Stdio::null())
        .stdout(Stdio::from(stdout))
        .stderr(Stdio::from(stderr))
        .spawn()?;
    append_log(app, &format!("apps service spawned: pid={}", child.id()));
    Ok(child)
}

// 这里专门负责真正拉起两个 Node 服务，和前面的 workspace 准备逻辑分开。
fn spawn_workspace_processes(
    app: &AppHandle,
    workspace: &std::path::Path,
) -> io::Result<(std::process::Child, std::process::Child)> {
    let mut main = spawn_main_process(app, workspace)?;
    let apps = match spawn_apps_process(app, workspace) {
        Ok(child) => child,
        Err(err) => {
            append_log(app, &format!("failed to spawn apps service: {err}"));
            let _ = main.kill();
            let _ = main.wait();
            return Err(err);
        }
    };
    Ok((main, apps))
}

// 进程守护：每隔几秒看一眼 state.main / state.apps,死了就拉回来。
// AI 在 chat 里 pkill 自己的 node 进程不至于把整个体验干废,等几秒会自动恢复。
pub(crate) fn start_services(app: AppHandle, _open_after_ready: bool) {
    let text = shell_text();
    let workspace_current = workspace_is_current(&app);

    if service_is_ready() && workspace_current {
        update_tray_status(&app);
        show_app_window(&app);
        return;
    }

    if service_is_ready() && !workspace_current {
        append_log(
            &app,
            "stale workspace detected on active service; restarting local services",
        );
        stop_any_running_services(&app);
    }

    if !mark_initializing_or_show_existing(&app) {
        return;
    }

    update_tray_status(&app);

    show_status_window(&app, text.starting_title, text.starting_message);

    thread::spawn(move || {
        let text = shell_text();
        let result = (|| -> io::Result<()> {
            let workspace = prepare_workspace(&app)?;

            show_status_window(&app, text.starting_title, text.starting_launching);
            stop_any_running_services(&app);
            let (main, apps) = spawn_workspace_processes(&app, &workspace)?;

            let state_handle = app.state::<Mutex<ServiceState>>();
            let mut state = state_handle.lock().expect("service state poisoned");
            state.main = Some(main);
            state.apps = Some(apps);
            append_log(&app, "server processes spawned");
            drop(state);
            update_tray_status(&app);
            Ok(())
        })();

        {
            let state_handle = app.state::<Mutex<ServiceState>>();
            let mut state = state_handle.lock().expect("service state poisoned");
            state.initializing = false;
            if result.is_err() {
                state.main = None;
                state.apps = None;
            }
        }

        update_tray_status(&app);

        match result {
            Ok(()) => {
                show_status_window(&app, text.starting_title, text.starting_health);
                if wait_for_health(&app) {
                    append_log(&app, "health check passed");
                    update_tray_status(&app);
                    show_app_window(&app);
                } else {
                    append_log(&app, "health check timed out");
                    stop_services(&app);
                    show_status_window(
                        &app,
                        text.startup_failed_title,
                        text.startup_health_timeout,
                    );
                }
            }
            Err(err) => {
                append_log(&app, &format!("service initialization failed: {err}"));
                update_tray_status(&app);
                show_status_window(
                    &app,
                    text.startup_failed_title,
                    &format!("Startup failed: {err}"),
                );
            }
        }
    });
}
