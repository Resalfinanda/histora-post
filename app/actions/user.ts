"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";
import { GetUserProfileResponse, UpdateProfileResponse } from "@/types/user";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import { deleteImage, getStoragePath } from "@/lib/storage/delete-image";

type ChangePasswordResponse = {
  success: boolean;
  message: string;
  error?: string;
};

export async function changePassword(
  formData: FormData,
): Promise<ChangePasswordResponse> {
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

type CreateUserResponse = {
  success: boolean;
  message: string;
};

export async function createUser(
  formData: FormData,
): Promise<CreateUserResponse> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      message: "Akses ditolak. Hanya Admin yang dapat membuat akun.",
    };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah digunakan oleh pengguna lain.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
      },
    });

    revalidatePath("/dashboard/users");

    return { success: true, message: "Pengguna baru berhasil ditambahkan!" };
  } catch (error: unknown) {
    console.error("Create User Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat menyimpan data.",
    };
  }
}

type DeleteUserResponse = {
  success: boolean;
  message: string;
};

export async function deleteUser(userId: string): Promise<DeleteUserResponse> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return {
      success: false,
      message: "Akses ditolak. Hanya Admin yang dapat menghapus akun.",
    };
  }

  if (session.user.id === userId) {
    return {
      success: false,
      message: "Anda tidak dapat menghapus akun Anda sendiri!",
    };
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/dashboard/users");
    return { success: true, message: "Akun pengguna berhasil dihapus." };
  } catch (error) {
    console.error("Delete User Error:", error);
    return {
      success: false,
      message:
        "Gagal menghapus pengguna. Pastikan pengguna ini tidak terikat dengan data penting lainnya.",
    };
  }
}

export async function getUserProfile(): Promise<GetUserProfileResponse> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Tidak terautentikasi", data: null };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        institution: true,
        profileImageUrl: true,
        role: true,
      },
    });

    if (!user)
      return { success: false, message: "User tidak ditemukan", data: null };

    return {
      success: true,
      message: "Profil user berhasil diambil",
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan sistem",
      error: (error as Error).message,
      data: null,
    };
  }
}

export async function updateUserProfile(
  formData: FormData,
): Promise<UpdateProfileResponse> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Tidak terautentikasi" };

  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const institution = formData.get("institution") as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || undefined,
        phoneNumber: phoneNumber || null,
        institution: institution || null,
      },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        institution: true,
        profileImageUrl: true,
        role: true,
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        message: "Gagal mengambil data profil setelah update",
      };
    }

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Profil berhasil diperbarui!",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update Profile Error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat memperbarui profil",
      error: (error as Error).message,
    };
  }
}

export async function updateProfileImage(
  profileImageUrl: string,
): Promise<UpdateProfileResponse> {
  const session = await auth();
  if (!session?.user?.id)
    return { success: false, message: "Tidak terautentikasi" };

  let oldProfileImageUrl: string | null = null;
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profileImageUrl: true },
    });
    oldProfileImageUrl = currentUser?.profileImageUrl || null;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { profileImageUrl },
    });

    if (oldProfileImageUrl && oldProfileImageUrl !== profileImageUrl) {
      const oldImagePath = getStoragePath(
        oldProfileImageUrl,
        STORAGE_BUCKETS.profile,
      );
      if (oldImagePath) {
        await deleteImage(STORAGE_BUCKETS.profile, oldImagePath).catch(
          (storageError) =>
            console.error("Gagal menghapus foto profil lama:", storageError),
        );
      }
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        institution: true,
        profileImageUrl: true,
        role: true,
      },
    });

    revalidatePath("/dashboard/settings");
    return {
      success: true,
      message: "Foto profil berhasil diperbarui!",
      data: updatedUser || undefined,
    };
  } catch (error) {
    const newImagePath = getStoragePath(
      profileImageUrl,
      STORAGE_BUCKETS.profile,
    );
    if (newImagePath) {
      await deleteImage(STORAGE_BUCKETS.profile, newImagePath).catch(
        (cleanupError) =>
          console.error("Gagal membersihkan foto profil baru:", cleanupError),
      );
    }
    return {
      success: false,
      message: "Gagal memperbarui foto profil",
      error: (error as Error).message,
    };
  }
}

export async function removeProfileImage(): Promise<UpdateProfileResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Tidak terautentikasi" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profileImageUrl: true },
    });

    await prisma.user.update({
      where: { id: session.user.id },
      data: { profileImageUrl: null },
    });

    if (user?.profileImageUrl) {
      const imagePath = getStoragePath(
        user.profileImageUrl,
        STORAGE_BUCKETS.profile,
      );
      if (imagePath) {
        await deleteImage(STORAGE_BUCKETS.profile, imagePath).catch(
          (storageError) =>
            console.error(
              "Gagal menghapus foto profil dari storage:",
              storageError,
            ),
        );
      }
    }

    revalidatePath("/dashboard/settings");
    return { success: true, message: "Foto profil berhasil dihapus" };
  } catch (error) {
    return {
      success: false,
      message: "Gagal menghapus foto profil",
      error: (error as Error).message,
    };
  }
}
