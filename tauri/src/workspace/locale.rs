use std::{
    fs,
    path::{Path, PathBuf},
    sync::OnceLock,
};

use serde_json::{Map, Value};
use tauri::AppHandle;

use crate::workspace::paths::workspace_dir;

const ZH: &str = "zh";
const EN: &str = "en";
const DEFAULT_LOCALE: &str = EN;

static CURRENT_LOCALE: OnceLock<String> = OnceLock::new();

fn settings_path(workspace: &Path) -> PathBuf {
    workspace.join(".aios").join("settings.json")
}

fn read_locale_from_settings(path: &Path) -> Option<String> {
    let raw = fs::read_to_string(path).ok()?;
    let value: Value = serde_json::from_str(&raw).ok()?;
    let locale = value.get("locale")?.as_str()?.to_string();
    normalize(&locale)
}

fn normalize(candidate: &str) -> Option<String> {
    let lower = candidate.trim().to_ascii_lowercase();
    if lower.is_empty() {
        return None;
    }
    if lower.starts_with(ZH) {
        return Some(ZH.to_string());
    }
    if lower.starts_with(EN) {
        return Some(EN.to_string());
    }
    None
}

fn detect_system_locale() -> String {
    sys_locale::get_locale()
        .and_then(|value| normalize(&value))
        .unwrap_or_else(|| DEFAULT_LOCALE.to_string())
}

fn write_locale(workspace: &Path, locale: &str) -> std::io::Result<()> {
    let path = settings_path(workspace);
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut map: Map<String, Value> = fs::read_to_string(&path)
        .ok()
        .and_then(|raw| serde_json::from_str::<Value>(&raw).ok())
        .and_then(|value| value.as_object().cloned())
        .unwrap_or_default();

    map.insert("locale".to_string(), Value::String(locale.to_string()));
    map.insert(
        "appliedAt".to_string(),
        Value::String(epoch_seconds_string()),
    );

    let serialized = serde_json::to_string_pretty(&Value::Object(map))
        .unwrap_or_else(|_| format!("{{\n  \"locale\": \"{locale}\"\n}}"));
    fs::write(path, format!("{serialized}\n"))
}

fn epoch_seconds_string() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or_default();
    seconds.to_string()
}

pub(crate) fn init_locale(app: &AppHandle) -> String {
    if let Some(cached) = CURRENT_LOCALE.get() {
        return cached.clone();
    }

    let workspace = workspace_dir(app);
    let settings = settings_path(&workspace);

    let locale = read_locale_from_settings(&settings).unwrap_or_else(|| {
        let detected = detect_system_locale();
        let _ = fs::create_dir_all(workspace.join(".aios"));
        let _ = write_locale(&workspace, &detected);
        detected
    });

    let _ = CURRENT_LOCALE.set(locale.clone());
    locale
}

pub(crate) fn current_locale() -> &'static str {
    CURRENT_LOCALE
        .get()
        .map(|value| value.as_str())
        .unwrap_or(DEFAULT_LOCALE)
}

pub(crate) fn ensure_settings_locale(workspace: &Path) -> std::io::Result<String> {
    let settings = settings_path(workspace);
    if let Some(existing) = read_locale_from_settings(&settings) {
        return Ok(existing);
    }
    let locale = current_locale().to_string();
    write_locale(workspace, &locale)?;
    Ok(locale)
}
