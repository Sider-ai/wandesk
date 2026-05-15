export type Session = {
  sessionId: string;
  title?: string;
  cwd?: string;
  messageCount?: number;
  updatedAt?: string;
  permissionMode?: string;
};

export type WorkspaceTab = { id: string; icon: string; label: string };

export type PermissionMode = { id: string; label: string; description: string };

export type CodeWorkspaceProps = {
  basePath: string;
  title: string;
  emptyIcon: string;
  memoryLabel: string;
  projectLabel: string;
  tabs: WorkspaceTab[];
  defaultPermissionMode: string;
  permissionModes: PermissionMode[];
};
