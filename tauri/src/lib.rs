use std::env;
use std::fs;
use std::path::PathBuf;
use std::process::Child;
use std::sync::Mutex;
use std::time::Duration;

use tauri::{Manager, RunEvent, WebviewWindowBuilder, WebviewUrl};

mod sidecar;

/// State holding the managed sidecar processes.
struct AppState {
    main_process: Mutex<Option<Child>>,
    apps_process: Mutex<Option<Child>>,
    main_port: Mutex<u16>,
    apps_port: Mutex<u16>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {
            // Focus existing window when second instance is launched
        }))
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            main_process: Mutex::new(None),
            apps_process: Mutex::new(None),
            main_port: Mutex::new(0),
            apps_port: Mutex::new(0),
        })
        .setup(|app| {
            let handle = app.handle().clone();

            // Spawn servers in a background thread so setup doesn't block
            std::thread::spawn(move || {
                if let Err(e) = boot_servers(&handle) {
                    eprintln!("[wandesk] Failed to boot servers: {e}");
                    handle.exit(1);
                }
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|app, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            RunEvent::Exit => {
                println!("[wandesk] Cleaning up sidecar processes...");
                cleanup_sidecars(app);
            }
            _ => {}
        });
}

/// Main boot sequence: allocate ports → spawn splash → start servers → show main window.
fn boot_servers(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    // 1. Find free ports
    let main_port = portpicker::pick_unused_port()
        .ok_or("Failed to find a free port for main server")?;
    let apps_port = portpicker::pick_unused_port()
        .ok_or("Failed to find a free port for apps server")?;

    println!("[wandesk] Allocated ports: main={}, apps={}", main_port, apps_port);

    // Store ports in state
    {
        let state = app.state::<AppState>();
        *state.main_port.lock().unwrap() = main_port;
        *state.apps_port.lock().unwrap() = apps_port;
    }

    // 2. Resolve data directory
    let data_dir = resolve_data_dir();
    fs::create_dir_all(&data_dir)?;
    println!("[wandesk] Data directory: {}", data_dir.display());

    let resource_dir = resolve_resource_dir(app);
    println!("[wandesk] Resource directory: {}", resource_dir.display());

    // 3. Clean up orphaned processes from previous crashes
    sidecar::cleanup_orphans(main_port, apps_port);

    // 4. Show splash screen
    let splash = WebviewWindowBuilder::new(
        app,
        "splash",
        WebviewUrl::App("splash.html".into()),
    )
    .title("Wandesk")
    .inner_size(480.0, 320.0)
    .center()
    .resizable(false)
    .decorations(false)
    .always_on_top(true)
    .build()?;

    // 5. Spawn Node.js servers
    let node_bin = resolve_node_binary();
    let tsx_cli = resource_dir.join("node_modules").join("tsx").join("dist").join("cli.mjs");
    let server_entry = resource_dir.join("server").join("main").join("index.ts");
    let apps_entry = resource_dir.join("server").join("apps").join("index.ts");

    // Build env with AIOS_DATA_DIR
    let mut env_vars: std::collections::HashMap<String, String> = std::env::vars().collect();
    env_vars.insert("AIOS_DATA_DIR".into(), data_dir.to_string_lossy().into());
    env_vars.insert("AIOS_MAIN_PORT".into(), main_port.to_string());
    env_vars.insert("AIOS_APPS_PORT".into(), apps_port.to_string());
    env_vars.insert("AIOS_DESKTOP_MODE".into(), "1".into());
    sidecar::enhance_path(&mut env_vars);

    println!("[wandesk] Spawning main server on port {}...", main_port);
    let main_child = sidecar::spawn_server(
        &node_bin,
        &tsx_cli,
        &server_entry,
        main_port,
        &resource_dir,
        &env_vars,
    )?;

    println!("[wandesk] Spawning apps server on port {}...", apps_port);
    let apps_child = sidecar::spawn_server(
        &node_bin,
        &tsx_cli,
        &apps_entry,
        apps_port,
        &resource_dir,
        &env_vars,
    )?;

    // Store processes in state
    {
        let state = app.state::<AppState>();
        *state.main_process.lock().unwrap() = Some(main_child);
        *state.apps_process.lock().unwrap() = Some(apps_child);
    }

    // 6. Health-check main server
    let health_url = format!("http://127.0.0.1:{main_port}/api/health");
    println!("[wandesk] Waiting for main server...");
    sidecar::wait_for_health(&health_url, 60, Duration::from_millis(500))?;

    // 7. Health-check apps server
    let apps_health_url = format!("http://127.0.0.1:{apps_port}/apps/health");
    println!("[wandesk] Waiting for apps server...");
    sidecar::wait_for_health(&apps_health_url, 30, Duration::from_millis(500))?;

    println!("[wandesk] All servers ready!");

    // 8. Close splash, show main window
    let _ = splash.close();

    let main_window = WebviewWindowBuilder::new(
        app,
        "main",
        WebviewUrl::External(format!("http://127.0.0.1:{main_port}").parse().unwrap()),
    )
    .title("Wandesk")
    .inner_size(1280.0, 800.0)
    .min_inner_size(960.0, 600.0)
    .center()
    .build()?;

    let _ = main_window.set_focus();

    Ok(())
}

/// Resolve platform-specific data directory for Wandesk.
fn resolve_data_dir() -> PathBuf {
    if let Ok(dir) = env::var("AIOS_DATA_DIR") {
        return PathBuf::from(dir);
    }
    dirs::data_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("Wandesk")
}

/// Resolve the resource directory containing the Node.js application.
fn resolve_resource_dir(app: &tauri::AppHandle) -> PathBuf {
    if cfg!(debug_assertions) {
        // Dev mode: use repo root (parent of tauri/)
        let manifest_dir = env::var("CARGO_MANIFEST_DIR")
            .expect("CARGO_MANIFEST_DIR not set");
        PathBuf::from(manifest_dir)
            .parent()
            .expect("tauri/ must have a parent")
            .to_path_buf()
    } else {
        // Production: use Tauri's runtime resource directory
        app.path()
            .resource_dir()
            .expect("Failed to resolve Tauri resource directory")
            .join("aios")
    }
}

/// Resolve Node.js binary path.
fn resolve_node_binary() -> String {
    env::var("AIOS_NODE_BIN").unwrap_or_else(|_| "node".into())
}

/// Kill sidecar processes on app exit.
fn cleanup_sidecars(app: &tauri::AppHandle) {
    let state = app.state::<AppState>();

    {
        let mut guard = state.main_process.lock().unwrap();
        if let Some(ref mut child) = *guard {
            sidecar::kill_process(child);
        }
        *guard = None;
    };
    {
        let mut guard = state.apps_process.lock().unwrap();
        if let Some(ref mut child) = *guard {
            sidecar::kill_process(child);
        }
        *guard = None;
    };
}
