export type Project = {
  id: string;
  title: string;
  prompt: string;
  created_at: string;
  node_count?: number;
  generating_count?: number;
};
export type NodeStatus = 'generating' | 'done' | 'error';
export type TreeNode = {
  id: string;
  project_id: string;
  parent_id: string | null;
  instruction: string;
  title: string | null;
  status: NodeStatus;
  error: string | null;
  created_at: string;
  has_content: 0 | 1;
};
export type Tree = { project: Project; nodes: TreeNode[] };
