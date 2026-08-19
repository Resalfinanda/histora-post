import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      profileImageUrl?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
    profileImageUrl?: string | null;
  }
}
