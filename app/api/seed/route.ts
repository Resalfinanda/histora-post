import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Cek apakah email admin ini sudah ada di database
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@historapost.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: "Admin sudah ada, tidak perlu dibuat lagi.",
      });
    }

    // Hash password 
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Masukkan ke database
    const newAdmin = await prisma.user.create({
      data: {
        name: "Admin Utama",
        email: "admin@historapost.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "Sukses! Akun admin berhasil dibuat.",
      email: newAdmin.email,
      password: "admin123", // Hanya untuk info, password aslinya di-hash di DB
    });
  } catch (error) {
    console.error("Gagal membuat admin:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
