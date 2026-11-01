import type { WorkspaceRole } from "./workspace-rules";
export type WorkspaceContextUnavailable = {
  available: false;
  workspaces: [];
  activeWorkspaceId: null;
  activeRole: WorkspaceRole | null;
};
/** Unavailable is never a successful personal scope or a membership grant. */
export function unavailableWorkspaceContext(): WorkspaceContextUnavailable {
  return { available: false, workspaces: [], activeWorkspaceId: null, activeRole: null };
}