// auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

console.log("Initializing NextAuth"); // Log d'initialisation

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      console.log("Sign-in attempt:", { user, account });
      return true;
    },
  },
});

export const { handlers } = NextAuth(authConfig);
