import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

class InvalidLoginError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            profileImageUrl: true,
          },
        });

        // ERROR: User tidak ditemukan
        if (!user) {
          throw new InvalidLoginError("Email tidak terdaftar");
        }

        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        // ERROR: Password salah
        if (!passwordsMatch) {
          throw new InvalidLoginError("Password yang Anda masukkan salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profileImageUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.profileImageUrl = user.profileImageUrl;
      }

      if (trigger === "update" && session) {
        const updatedUser = session.user ?? session;
        token.name = updatedUser.name;
        token.profileImageUrl = updatedUser.profileImageUrl;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.profileImageUrl = token.profileImageUrl as
          | string
          | null
          | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
