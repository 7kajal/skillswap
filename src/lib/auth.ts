import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import {
  findOrCreateOAuthUser,
  findUserByEmail,
  verifyPassword,
} from "@/app/api/auth/service";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GitHub,
    Google,
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await findUserByEmail(credentials.email as string);
        if (!user || !user.password) return null;
        const valid = await verifyPassword(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials" && !user.email) return false;
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider && account.provider !== "credentials" && user.email) {
          const localUser = await findOrCreateOAuthUser({
            name: user.name,
            email: user.email,
            image: user.image,
          });
          token.id = localUser._id.toString();
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
