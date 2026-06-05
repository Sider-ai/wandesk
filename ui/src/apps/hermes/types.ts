export type HermesStatus = {
  online: boolean;
  version?: string | null;
  updateAvailable?: boolean;
  project?: string;
  python?: string;
  model?: string;
  provider?: string;
  dashboardRunning?: boolean;
  dashboardPid?: string;
  dashboardUrl?: string;
  gateway?: boolean;
  gatewayStatus?: string;
  cronJobs?: number;
  sessionsCount?: number;
  activeSessions?: number;
  statusIssue?: string;
};

export type HermesSession = {
  id: string;
  title?: string;
  source?: string;
  model?: string;
  startedAt?: number;
  lastActive?: number;
  endedAt?: number | null;
  messageCount?: number;
  toolCallCount?: number;
  inputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  reasoningTokens?: number;
  apiCallCount?: number;
  preview?: string;
};

export type HermesMessage = {
  id: number | string;
  role: string;
  content: string;
  toolName?: string;
  timestamp?: number;
  tokenCount?: number;
  finishReason?: string;
};

export type HermesRoutine = string;

export type HermesChatResponse = {
  success: boolean;
  reply?: string;
  message?: string;
  meta?: {
    sessionId?: string;
    durationMs?: number;
    model?: string;
    provider?: string;
  };
};
