use serde_json::json;
use tauri::{
    image::Image,
    menu::{Menu, MenuEvent, MenuItem},
    tray::{TrayIcon, TrayIconBuilder},
    AppHandle, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};

use crate::{
    shell::shell_text,
    workspace::services::{
        service_is_ready, start_services, stop_any_running_services,
    },
    AIOS_URL,
};

#[cfg(windows)]
const SHELL_INDEX_ORIGIN: &str = "http://tauri.localhost";
#[cfg(not(windows))]
const SHELL_INDEX_ORIGIN: &str = "tauri://localhost";

// Tauri 默认把 <a target="_blank"> 当弹窗吞掉。在 document 上冒泡前拦一层,
// 改成当前窗口导航,on_navigation 会抓到、路由到系统浏览器。
const TARGET_BLANK_HANDOFF_SCRIPT: &str = r#"(function(){
  document.addEventListener('click', function(e){
    var t = e.target;
    if (!t || !t.closest) return;
    var a = t.closest('a[target="_blank"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('javascript:') === 0) return;
    e.preventDefault();
    window.location.href = href;
  }, true);
})();"#;

pub(crate) struct BuiltTray {
    pub tray: TrayIcon,
}

fn ensure_shell_window(
    app: &AppHandle,
    label: &str,
    title: &str,
    page: &str,
    width: f64,
    height: f64,
    resizable: bool,
) -> tauri::Result<WebviewWindow> {
    if let Some(window) = app.get_webview_window(label) {
        return Ok(window);
    }

    let mut builder =
        WebviewWindowBuilder::new(app, label, WebviewUrl::App(page.into()))
            .title(title)
            .inner_size(width, height)
            .visible(false)
            .skip_taskbar(true)
            .resizable(resizable);

    if let Some(icon) = app.default_window_icon().cloned() {
        builder = builder.icon(icon)?;
    }

    builder.build()
}

fn ensure_main_window(app: &AppHandle) -> Option<WebviewWindow> {
    if let Some(window) = app.get_webview_window("main") {
        return Some(window);
    }

    let mut builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
        .title(shell_text().shell_title)
        .inner_size(1400.0, 900.0)
        .min_inner_size(960.0, 640.0)
        .resizable(true)
        .maximizable(true)
        .minimizable(true)
        .closable(true)
        .decorations(true)
        .visible(false)
        .disable_drag_drop_handler()
        .initialization_script(TARGET_BLANK_HANDOFF_SCRIPT)
        .on_navigation(|url| {
            let scheme = url.scheme();
            if scheme != "http" && scheme != "https" {
                return true;
            }
            let host = url.host_str().unwrap_or("");
            if matches!(host, "127.0.0.1" | "localhost" | "tauri.localhost") {
                return true;
            }
            let _ = tauri_plugin_opener::open_url(url.as_str(), None::<String>);
            false
        });

    // macOS: 显式声明标题栏样式,确保 NSWindow 的 4 边 4 角 native resize 区域正常工作。
    // 默认行为下 wry 的 NSView 会盖住窗口边缘 hit area,导致只有右下 size box 能拖。
    #[cfg(target_os = "macos")]
    {
        builder = builder.title_bar_style(tauri::TitleBarStyle::Visible);
    }

    builder.build().ok()
}

fn is_on_app_url(window: &WebviewWindow) -> bool {
    window
        .url()
        .ok()
        .map(|u| u.as_str().starts_with(AIOS_URL))
        .unwrap_or(false)
}

fn navigate_to_shell(window: &WebviewWindow) {
    let url_str = format!("{SHELL_INDEX_ORIGIN}/index.html");
    if let Ok(url) = url_str.parse::<tauri::Url>() {
        let _ = window.navigate(url);
    }
}

// 启动页和真正的 AIOS 页面是两个阶段，这里统一负责切换，避免各处重复写跳转脚本。
pub(crate) fn show_app_window(app: &AppHandle) {
    let Some(window) = ensure_main_window(app) else {
        return;
    };
    if is_on_app_url(&window) {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
        return;
    }

    let script = format!("window.location.replace('{AIOS_URL}');");
    let _ = window.eval(&script);
    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();
}

pub(crate) fn show_status_window(app: &AppHandle, title: &str, message: &str) {
    let Some(window) = ensure_main_window(app) else {
        return;
    };

    if is_on_app_url(&window) {
        navigate_to_shell(&window);
    }

    let payload = json!({
        "title": title,
        "message": message,
    });
    let payload_json = serde_json::to_string(&payload).unwrap_or_else(|_| "{}".to_string());
    let script = format!(
        r#"(function apply(tries) {{
            if (window.__AIOS_STATUS_SET__) {{
                window.__AIOS_STATUS_SET__({payload_json});
            }} else if (tries < 60) {{
                setTimeout(function() {{ apply(tries + 1); }}, 50);
            }}
        }})(0);"#
    );
    let _ = window.eval(&script);
    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();
}

pub(crate) fn show_about_window(app: &AppHandle) {
    let client_version = app.package_info().version.to_string();

    if let Ok(window) = ensure_shell_window(
        app,
        "about",
        shell_text().about,
        "about.html",
        440.0,
        470.0,
        false,
    ) {
        let payload = json!({
            "clientVersion": client_version,
        });
        let payload_json = serde_json::to_string(&payload).unwrap_or_else(|_| "{}".to_string());
        let script =
            format!("window.__AIOS_ABOUT_SET__ && window.__AIOS_ABOUT_SET__({payload_json});");
        let _ = window.eval(&script);
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

pub(crate) fn prepare_shell_windows(app: &AppHandle) {
    let _ = ensure_main_window(app);

    let text = shell_text();
    let _ = ensure_shell_window(app, "about", text.about, "about.html", 440.0, 470.0, false);
}

pub(crate) fn build_tray(app: &AppHandle) -> tauri::Result<BuiltTray> {
    let text = shell_text();
    let open = MenuItem::with_id(app, "open", text.open, true, None::<&str>)?;
    let about = MenuItem::with_id(app, "about", text.about, true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", text.quit, true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&open, &about, &quit])?;

    let mut tray_builder = TrayIconBuilder::new()
        .tooltip("Wandesk")
        .show_menu_on_left_click(true)
        .icon_as_template(false)
        .menu(&menu)
        .on_menu_event(move |app, event: MenuEvent| match event.id().as_ref() {
            "open" => {
                if service_is_ready() {
                    show_app_window(app);
                } else {
                    start_services(app.clone(), true);
                }
            }
            "about" => show_about_window(app),
            "quit" => {
                stop_any_running_services(app);
                app.exit(0);
            }
            _ => {}
        });

    let tray_icon = Image::new(include_bytes!("../../icons/tray.rgba"), 64, 64);
    tray_builder = tray_builder.icon(tray_icon);

    let tray = tray_builder.build(app)?;
    Ok(BuiltTray { tray })
}
