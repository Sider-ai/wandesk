use std::process::Child;

use tauri::tray::TrayIcon;

#[derive(Default)]
pub(crate) struct ServiceState {
    pub main: Option<Child>,
    pub apps: Option<Child>,
    pub initializing: bool,
}

#[derive(Default)]
pub(crate) struct TrayState {
    pub tray: Option<TrayIcon>,
}

#[derive(serde::Serialize, Clone)]
pub(crate) struct SnapshotItem {
    pub hash: String,
    pub summary: String,
}
