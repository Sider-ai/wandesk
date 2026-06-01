#[cfg(feature = "dau")]
mod analytics;
mod shell;
mod state;
mod workspace;

use std::sync::Mutex;

use tauri::Manager;

use crate::{
    shell::ui::{build_tray, prepare_shell_windows},
    state::{ServiceState, TrayState},
    workspace::{
        locale::init_locale,
        services::{
            reset_local_data_command, start_services, stop_any_running_services, update_tray_status,
        },
    },
};

pub(crate) const AIOS_URL: &str = "http://127.0.0.1:9502";
pub(crate) const MAIN_PORT: u16 = 9502;
pub(crate) const APPS_PORT: u16 = 9503;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 单实例:再次启动同一个 app 时,这里会被调用,把现有窗口拉前台,
        // 第二个进程自己退出。必须在其他插件之前注册。
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .manage(Mutex::<TrayState>::default())
        .manage(Mutex::<ServiceState>::default())
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![reset_local_data_command])
        .setup(|app| {
            let _ = init_locale(app.handle());
            #[cfg(feature = "dau")]
            analytics::ping_dau(app.handle().clone());
            stop_any_running_services(app.handle());
            prepare_shell_windows(app.handle());
            let built_tray = build_tray(app.handle())?;

            let tray_state = app.state::<Mutex<TrayState>>();
            let mut tray_state = tray_state.lock().expect("tray state poisoned");
            tray_state.tray = Some(built_tray.tray);
            drop(tray_state);

            update_tray_status(app.handle());

            start_services(app.handle().clone(), true);

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building Wandesk")
        .run(|_app, _event| {
            match &_event {
                tauri::RunEvent::ExitRequested { .. } | tauri::RunEvent::Exit => {
                    stop_any_running_services(_app);
                }
                _ => {}
            }

            #[cfg(target_os = "macos")]
            if let tauri::RunEvent::Reopen {
                has_visible_windows,
                ..
            } = &_event
            {
                if !has_visible_windows {
                    if let Some(window) = _app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                }
            }
        });
}
