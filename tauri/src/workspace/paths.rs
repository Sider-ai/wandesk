use std::{
    fs, io,
    io::Write,
    path::{Path, PathBuf},
    sync::{Mutex, OnceLock},
    time::{SystemTime, UNIX_EPOCH},
};

use serde_json::Value;
use tauri::{AppHandle, Manager};

const PRESERVED_WORKSPACE_ENTRIES: &[&str] = &[
    ".aios",
    ".git",
    "apps",
    "database",
    "files",
    "gui/src/apps",
    "gui/src/apps.js",
    "language/en/gui/views/apps",
    "language/zh/gui/views/apps",
    "server/apps",
];

fn workspace_refresh_lock() -> &'static Mutex<()> {
    static LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    LOCK.get_or_init(|| Mutex::new(()))
}

fn unique_workspace_dir_name(prefix: &str) -> String {
    format!(
        "{prefix}-{}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|duration| duration.as_nanos())
            .unwrap_or_default()
    )
}

pub(crate) fn app_log_dir(app: &AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("missing app data dir")
        .join("logs")
}

pub(crate) fn append_log(app: &AppHandle, message: &str) {
    let dir = app_log_dir(app);
    let _ = fs::create_dir_all(&dir);
    let path = dir.join("tray.log");
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::SystemTime::UNIX_EPOCH)
        .map(|d| d.as_secs())
        .unwrap_or_default();
    if let Ok(mut file) = fs::OpenOptions::new().create(true).append(true).open(path) {
        let _ = writeln!(file, "[{timestamp}] {message}");
    }
}

pub(crate) fn command_log_file(app: &AppHandle, name: &str) -> io::Result<fs::File> {
    let dir = app_log_dir(app);
    fs::create_dir_all(&dir)?;
    fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(dir.join(name))
}

pub(crate) fn resource_root(app: &AppHandle) -> PathBuf {
    app.path()
        .resource_dir()
        .expect("missing resource dir")
        .join("resources")
}

pub(crate) fn workspace_template_dir(app: &AppHandle) -> PathBuf {
    if cfg!(debug_assertions) {
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("resources")
            .join("aios")
    } else {
        resource_root(app).join("aios")
    }
}

pub(crate) fn node_binary_path(app: &AppHandle) -> PathBuf {
    let file = if cfg!(target_os = "windows") {
        "node.exe"
    } else {
        "node"
    };
    // Packaged distributions may bundle a private runtime under
    // resources/vendor/node; this open-source build does not, so fall back to
    // the system `node` on PATH (requires Node >= 22.5).
    let vendored = resource_root(app).join("vendor").join("node").join(file);
    if vendored.exists() {
        vendored
    } else {
        PathBuf::from(file)
    }
}

#[allow(dead_code)]
pub(crate) fn git_binary_path(app: &AppHandle) -> PathBuf {
    let file = if cfg!(target_os = "windows") {
        "git.exe"
    } else {
        "git"
    };
    let vendored = resource_root(app)
        .join("vendor")
        .join("git")
        .join("bin")
        .join(file);
    if vendored.exists() {
        vendored
    } else {
        PathBuf::from(file)
    }
}

#[allow(dead_code)]
pub(crate) fn git_template_path(app: &AppHandle) -> PathBuf {
    resource_root(app)
        .join("vendor")
        .join("git")
        .join("share")
        .join("git-core")
        .join("templates")
}

pub(crate) fn workspace_dir(app: &AppHandle) -> PathBuf {
    app.path()
        .app_data_dir()
        .expect("missing app data dir")
        .join("workspace")
}

fn expected_workspace_template_version(app: &AppHandle) -> String {
    app.package_info().version.to_string()
}

fn workspace_template_marker_path(app: &AppHandle) -> PathBuf {
    workspace_dir(app).join(".template-version")
}

fn workspace_package_scripts_are_valid(workspace: &Path) -> bool {
    let package_path = workspace.join("package.json");
    let raw = match fs::read_to_string(package_path) {
        Ok(raw) => raw,
        Err(_) => return false,
    };
    let parsed = match serde_json::from_str::<Value>(&raw) {
        Ok(parsed) => parsed,
        Err(_) => return false,
    };
    let scripts = match parsed.get("scripts").and_then(Value::as_object) {
        Some(scripts) => scripts,
        None => return false,
    };
    ["build", "start", "start:apps"].iter().all(|key| {
        scripts
            .get(*key)
            .and_then(Value::as_str)
            .map(|value| !value.trim().is_empty())
            .unwrap_or(false)
    })
}

fn workspace_needs_refresh(workspace: &Path, marker: &Path, expected_version: &str) -> bool {
    let current_version = fs::read_to_string(marker).unwrap_or_default();
    !workspace.join("package.json").exists()
        || current_version.trim() != expected_version
        || !workspace_package_scripts_are_valid(workspace)
}

pub(crate) fn workspace_is_current(app: &AppHandle) -> bool {
    fs::read_to_string(workspace_template_marker_path(app))
        .map(|value| value.trim() == expected_workspace_template_version(app))
        .unwrap_or(false)
}

pub(crate) fn reset_workspace_data(app: &AppHandle) -> io::Result<()> {
    let workspace = workspace_dir(app);
    let workspace_parent = workspace
        .parent()
        .ok_or_else(|| io::Error::other("workspace directory is missing a parent"))?
        .to_path_buf();

    let _guard = workspace_refresh_lock()
        .lock()
        .map_err(|_| io::Error::other("workspace refresh lock poisoned"))?;

    if workspace.exists() {
        fs::remove_dir_all(&workspace)?;
    }

    if workspace_parent.exists() {
        for entry in fs::read_dir(&workspace_parent)? {
            let entry = entry?;
            let name = entry.file_name().to_string_lossy().to_string();
            if name.starts_with(".workspace-staging-") || name.starts_with(".workspace-preserve-") {
                let path = entry.path();
                if path.is_dir() {
                    let _ = fs::remove_dir_all(path);
                }
            }
        }
    }

    append_log(app, "workspace data reset requested");
    Ok(())
}

pub(crate) fn copy_dir_recursive(src: &Path, dst: &Path) -> io::Result<()> {
    copy_dir_merge(src, dst)
}

pub(crate) fn copy_dir_replace(src: &Path, dst: &Path) -> io::Result<()> {
    #[cfg(target_os = "macos")]
    {
        if dst.exists() {
            fs::remove_dir_all(dst)?;
        }
        if let Some(parent) = dst.parent() {
            fs::create_dir_all(parent)?;
        }
        let status = std::process::Command::new("ditto")
            .arg(src)
            .arg(dst)
            .status()?;
        if !status.success() {
            return Err(io::Error::other(format!(
                "failed to copy directory {} -> {} with ditto",
                src.display(),
                dst.display()
            )));
        }
        return Ok(());
    }

    #[cfg(not(target_os = "macos"))]
    {
        if !dst.exists() {
            fs::create_dir_all(dst)?;
        }
        for entry in fs::read_dir(src)? {
            let entry = entry?;
            let src_path = entry.path();
            let dst_path = dst.join(entry.file_name());
            let file_type = entry.file_type()?;
            if file_type.is_dir() {
                copy_dir_recursive(&src_path, &dst_path)?;
            } else if file_type.is_file() {
                if let Some(parent) = dst_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                copy_file_preserving_metadata(&src_path, &dst_path)?;
            }
        }
        Ok(())
    }
}

pub(crate) fn copy_dir_merge(src: &Path, dst: &Path) -> io::Result<()> {
    if !dst.exists() {
        fs::create_dir_all(dst)?;
    }
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());
        let file_type = entry.file_type()?;
        if file_type.is_dir() {
            copy_dir_merge(&src_path, &dst_path)?;
        } else if file_type.is_file() {
            if let Some(parent) = dst_path.parent() {
                fs::create_dir_all(parent)?;
            }
            copy_file_preserving_metadata(&src_path, &dst_path)?;
        }
    }
    Ok(())
}

fn copy_file_preserving_metadata(src: &Path, dst: &Path) -> io::Result<()> {
    #[cfg(target_os = "macos")]
    {
        let status = std::process::Command::new("ditto")
            .arg(src)
            .arg(dst)
            .status()?;
        if !status.success() {
            return Err(io::Error::other(format!(
                "failed to copy {} -> {} with ditto",
                src.display(),
                dst.display()
            )));
        }
        return Ok(());
    }

    #[cfg(not(target_os = "macos"))]
    {
        fs::copy(src, dst)?;
        Ok(())
    }
}

fn preserve_workspace_entries(workspace: &Path, preserve_dir: &Path) -> io::Result<()> {
    if !workspace.exists() {
        return Ok(());
    }

    fs::create_dir_all(preserve_dir)?;
    for entry_name in PRESERVED_WORKSPACE_ENTRIES {
        let source = workspace.join(entry_name);
        if source.exists() {
            let target = preserve_dir.join(entry_name);
            if let Some(parent) = target.parent() {
                fs::create_dir_all(parent)?;
            }
            fs::rename(&source, target)?;
        }
    }
    fs::remove_dir_all(workspace)?;
    Ok(())
}

fn restore_preserved_workspace_entries(workspace: &Path, preserve_dir: &Path) -> io::Result<()> {
    if !preserve_dir.exists() {
        return Ok(());
    }

    for entry_name in PRESERVED_WORKSPACE_ENTRIES {
        let source = preserve_dir.join(entry_name);
        if !source.exists() {
            continue;
        }

        let target = workspace.join(entry_name);
        if let Some(parent) = target.parent() {
            fs::create_dir_all(parent)?;
        }
        restore_preserved_entry(&source, &target)?;
    }

    fs::remove_dir_all(preserve_dir)?;
    Ok(())
}

fn restore_preserved_entry(source: &Path, target: &Path) -> io::Result<()> {
    if target.exists() {
        if source.is_dir() && target.is_dir() {
            restore_preserved_dir_missing_only(source, target)?;
            fs::remove_dir_all(source)?;
        }
        return Ok(());
    }

    if let Some(parent) = target.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::rename(source, target)?;
    Ok(())
}

fn restore_preserved_dir_missing_only(source: &Path, target: &Path) -> io::Result<()> {
    fs::create_dir_all(target)?;
    for entry in fs::read_dir(source)? {
        let entry = entry?;
        let source_path = entry.path();
        let target_path = target.join(entry.file_name());
        if target_path.exists() {
            if source_path.is_dir() && target_path.is_dir() {
                restore_preserved_dir_missing_only(&source_path, &target_path)?;
            }
            continue;
        }
        fs::rename(&source_path, &target_path)?;
    }
    Ok(())
}

fn rollback_failed_workspace_refresh(workspace: &Path, staging_dir: &Path, preserve_dir: &Path) {
    if staging_dir.exists() {
        let _ = fs::remove_dir_all(staging_dir);
    }
    if preserve_dir.exists() {
        let _ = fs::create_dir_all(workspace);
        for entry_name in PRESERVED_WORKSPACE_ENTRIES {
            let source = preserve_dir.join(entry_name);
            if source.exists() {
                let target = workspace.join(entry_name);
                if let Some(parent) = target.parent() {
                    let _ = fs::create_dir_all(parent);
                }
                let _ = fs::rename(&source, target);
            }
        }
        let _ = fs::remove_dir_all(preserve_dir);
    }
}

fn refresh_workspace_from_template(template: &Path, workspace: &Path) -> io::Result<()> {
    let workspace_parent = workspace
        .parent()
        .ok_or_else(|| io::Error::other("workspace directory is missing a parent"))?;
    let staging_dir = workspace_parent.join(unique_workspace_dir_name(".workspace-staging"));
    let preserve_dir = workspace_parent.join(unique_workspace_dir_name(".workspace-preserve"));

    // 刷新 workspace 时先把新模板复制到 staging，再原子替换 workspace，
    // 这样中途失败不会把用户现有 workspace 直接砸坏。
    let refresh_result = (|| -> io::Result<()> {
        fs::create_dir_all(&staging_dir)?;
        copy_dir_replace(template, &staging_dir)?;
        preserve_workspace_entries(workspace, &preserve_dir)?;
        fs::rename(&staging_dir, workspace)?;
        restore_preserved_workspace_entries(workspace, &preserve_dir)?;
        Ok(())
    })();

    if refresh_result.is_err() {
        rollback_failed_workspace_refresh(workspace, &staging_dir, &preserve_dir);
    }

    refresh_result
}

pub(crate) fn ensure_workspace(app: &AppHandle) -> io::Result<PathBuf> {
    let _guard = workspace_refresh_lock()
        .lock()
        .map_err(|_| io::Error::other("workspace refresh lock poisoned"))?;
    let template = workspace_template_dir(app);
    let workspace = workspace_dir(app);
    let expected = expected_workspace_template_version(app);
    let marker = workspace_template_marker_path(app);

    if workspace_needs_refresh(&workspace, &marker, &expected) {
        refresh_workspace_from_template(&template, &workspace)?;
        fs::write(marker, expected)?;
        append_log(
            app,
            &format!(
                "workspace refreshed from template in {}",
                workspace.display()
            ),
        );
    }

    fs::create_dir_all(workspace.join("database"))?;
    fs::create_dir_all(workspace.join("files"))?;
    Ok(workspace)
}
