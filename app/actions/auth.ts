// auth.ts
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

class InvalidLoginError extends CredentialsSignin {
  constructor(message: string) {
    super();
    this.code = message; // Kita masukkan pesan error ke properti code
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // providers: [
  //   Credentials({
  //     name: "Credentials",
  //     credentials: {
  //       email: { label: "Email", type: "email" },
  //       password: { label: "Password", type: "password" }
  //     },
  //     async authorize(credentials) {
  //       if (!credentials?.email || !credentials?.password) {
  //         return null;
  //       }

  //       // Cari user berdasarkan email
  //       const user = await prisma.user.findUnique({
  //         where: { email: credentials.email as string }
  //       });

  //       if (!user) {
  //         return null;
  //       }

  //       // Bandingkan password yang diinput dengan password hash di database
  //       const passwordsMatch = await bcrypt.compare(
  //         credentials.password as string,
  //         user.password
  //       );

  //       if (!passwordsMatch) {
  //         return null;
  //       }

  //       // Jika berhasil, kembalikan data user (termasuk role untuk RBAC)
  //       return {
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         role: user.role, // "ADMIN" atau "REDAKTUR"
  //       };
  //     }
  //   })
  // ],
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidLoginError("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
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
        };
      },
    }),
  ],
  callbacks: {
    // Memasukkan role & id ke dalam JWT token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Memasukkan role & id dari token ke Session agar bisa diakses di UI/Server
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Kita arahkan halaman login bawaan ke custom page kita
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET, // Wajib ada di .env!
});
