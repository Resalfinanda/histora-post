"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Tidak terautentikasi" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  try {
    // Ambil data user dari DB
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return { success: false, message: "User tidak ditemukan" };

    // Cek apakah password lama benar
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return { success: false, message: "Password saat ini salah!" };

    // Hash password baru dan simpan
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { success: true, message: "Password berhasil diperbarui!" };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan sistem",
      error: (error as Error).message,
    };
  }
}

export async function createUser(formData: FormData) {
  const session = await auth();

  // Proteksi Keamanan: Hanya ADMIN yang boleh membuat user baru
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "Akses ditolak. Hanya Admin yang dapat membuat akun." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  try {
    // Cek apakah email sudah terdaftar di database
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return { success: false, message: "Email sudah digunakan oleh pengguna lain." };
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan data ke database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role , 
      },
    });

    // Refresh halaman daftar user agar data baru langsung muncul
    revalidatePath("/dashboard/users");
    
    return { success: true, message: "Pengguna baru berhasil ditambahkan!" };
  } catch (error: unknown) {
    console.error("Create User Error:", error);
    return { success: false, message: "Terjadi kesalahan sistem saat menyimpan data." };
  }
}

export async function deleteUser(userId: string) {
  const session = await auth();
  
  // Proteksi: Hanya ADMIN yang boleh menghapus
  if (session?.user?.role !== "ADMIN") {
    return { success: false, message: "Akses ditolak. Hanya Admin yang dapat menghapus akun." };
  }

  // Proteksi: admin tidak bisa menghapus dirinya sendiri
  if (session.user.id === userId) {
    return { success: false, message: "Anda tidak dapat menghapus akun Anda sendiri!" };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/users");
    return { success: true, message: "Akun pengguna berhasil dihapus." };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { success: false, message: "Gagal menghapus pengguna. Pastikan pengguna ini tidak terikat dengan data penting lainnya." };
  }
}