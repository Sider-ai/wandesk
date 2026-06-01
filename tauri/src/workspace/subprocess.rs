// 小工具:给 std::process::Command 附加一个 .no_window() 的扩展,
// 在 Windows 上打 CREATE_NO_WINDOW(0x08000000),避免 GUI app spawn
// 子进程时闪出黑框 cmd 窗口。非 Windows 平台是 no-op。
use std::process::Command;

pub(crate) trait CommandExt {
    fn no_window(&mut self) -> &mut Self;
}

impl CommandExt for Command {
    #[cfg(windows)]
    fn no_window(&mut self) -> &mut Self {
        use std::os::windows::process::CommandExt as _;
        // CREATE_NO_WINDOW
        self.creation_flags(0x0800_0000)
    }

    #[cfg(not(windows))]
    fn no_window(&mut self) -> &mut Self {
        self
    }
}
