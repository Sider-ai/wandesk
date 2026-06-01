use crate::workspace::locale::current_locale;

pub(crate) struct ShellText {
    pub open: &'static str,
    pub restart: &'static str,
    pub backup: &'static str,
    pub about: &'static str,
    pub quit: &'static str,
    pub shell_title: &'static str,
    pub snapshot_created_message: &'static str,
    pub no_snapshot_changes: &'static str,
    pub rollback_title: &'static str,
    pub rollback_failed_title: &'static str,
    pub rollback_confirm_error: &'static str,
    pub starting_title: &'static str,
    pub starting_message: &'static str,
    pub starting_building: &'static str,
    pub starting_launching: &'static str,
    pub starting_health: &'static str,
    pub starting_in_progress: &'static str,
    pub starting_waiting: &'static str,
    pub startup_failed_title: &'static str,
    pub startup_health_timeout: &'static str,
}

const ZH_TEXT: ShellText = ShellText {
    open: "打开",
    restart: "重启",
    backup: "备份",
    about: "关于",
    quit: "退出",
    shell_title: "Wandesk",
    snapshot_created_message: "备份已创建。",
    no_snapshot_changes: "当前没有需要备份的改动。",
    rollback_title: "回滚备份",
    rollback_failed_title: "回滚失败",
    rollback_confirm_error: "请输入 ROLLBACK 以确认。",
    starting_title: "正在启动 Wandesk",
    starting_message: "正在准备本地运行环境并启动服务，这可能需要一点时间。",
    starting_building: "正在构建前端...",
    starting_launching: "正在启动本地服务...",
    starting_health: "正在等待健康检查...",
    starting_in_progress: "初始化已经在进行中。",
    starting_waiting: "正在等待本地服务就绪。",
    startup_failed_title: "Wandesk 启动失败",
    startup_health_timeout: "健康检查超时。请查看应用数据目录 logs/tray.log。",
};

const EN_TEXT: ShellText = ShellText {
    open: "Open",
    restart: "Restart",
    backup: "Backups",
    about: "About",
    quit: "Quit",
    shell_title: "Wandesk",
    snapshot_created_message: "Backup created.",
    no_snapshot_changes: "There are no changes to back up.",
    rollback_title: "Rollback Backup",
    rollback_failed_title: "Rollback Failed",
    rollback_confirm_error: "Type ROLLBACK to confirm.",
    starting_title: "Starting Wandesk",
    starting_message:
        "Preparing the local workspace and starting services. This may take a moment.",
    starting_building: "Building frontend...",
    starting_launching: "Starting local services...",
    starting_health: "Waiting for health check...",
    starting_in_progress: "Initialization is already in progress.",
    starting_waiting: "Waiting for local services to become ready.",
    startup_failed_title: "Wandesk Startup Failed",
    startup_health_timeout: "Health check timed out. See logs/tray.log in the app data directory.",
};

pub(crate) fn shell_text() -> &'static ShellText {
    match current_locale() {
        "zh" => &ZH_TEXT,
        _ => &EN_TEXT,
    }
}
