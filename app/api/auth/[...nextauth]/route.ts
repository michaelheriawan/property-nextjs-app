import { authOptions } from "@/utils/authOptions";
import NextAuth from "next-auth/next";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
