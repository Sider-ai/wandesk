// 程序级参数(不是用户设置)。用户设置在库里,见 data/settings.ts。
export const KERNEL_PORT = Number(process.env.WANDESK_PORT || 9600);

export const AGENT_LIMITS = {
  maxRounds: 32,
  errorMaxChars: 4000,
  bash: {
    executable: "/bin/bash",
    args: ["-lc"],
    minTimeoutMs: 1000,
    defaultTimeoutMs: 120000,
    maxTimeoutMs: 600000,
    maxOutputChars: 60000,
  },
  retry: { attempts: 3, baseMs: 500 },
};

/** 上下文压缩水位:最近一次用量超过它,下一轮开跑前先压缩。 */
export const COMPACT_WATERMARK = Number(process.env.WANDESK_COMPACT || 120000);
