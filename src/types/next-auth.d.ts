import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      defaultWorkspaceId?: string;
    };
  }

  interface User {
    id: string;
    defaultWorkspaceId?: string | null;
  }
}
