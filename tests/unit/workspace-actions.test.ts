import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockRequireUser = vi.fn();
const mockEnforceRateLimit = vi.fn();
const mockInviteToWorkspace = vi.fn();

vi.mock("@/server/actions/helpers", () => ({
  requireUser: mockRequireUser,
  enforceRateLimit: mockEnforceRateLimit,
}));

vi.mock("@/server/workspaces", () => ({
  acceptInvite: vi.fn(),
  cancelInvite: vi.fn(),
  createWorkspace: vi.fn(),
  inviteToWorkspace: mockInviteToWorkspace,
  renameWorkspace: vi.fn(),
  removeMember: vi.fn(),
  switchDefaultWorkspace: vi.fn(),
  updateMemberRole: vi.fn(),
}));

describe("inviteMemberAction", () => {
  beforeEach(() => {
    mockRequireUser.mockResolvedValue({ id: "user_123" });
    mockEnforceRateLimit.mockResolvedValue(undefined);
    mockInviteToWorkspace.mockResolvedValue({
      acceptUrl: "http://localhost:3000/invites/token-demo",
      delivered: false,
      invite: { workspaceId: "ws_123" },
    });
  });

  it("returns a shareable invite link when email delivery is skipped", async () => {
    const { inviteMemberAction } = await import("@/server/actions/workspace-actions");
    const formData = new FormData();
    formData.set("workspaceId", "ws_123");
    formData.set("email", "new@example.com");
    formData.set("role", "MEMBER");

    const result = await inviteMemberAction(formData);

    expect(result.success).toBe(true);
    expect(result.data?.acceptUrl).toBe("http://localhost:3000/invites/token-demo");
    expect(result.data?.delivered).toBe(false);
    expect(mockEnforceRateLimit).toHaveBeenCalledWith("workspace:invite:user_123");
    expect(mockInviteToWorkspace).toHaveBeenCalledWith({
      workspaceId: "ws_123",
      inviterId: "user_123",
      email: "new@example.com",
      role: "MEMBER",
    });
  });
});
