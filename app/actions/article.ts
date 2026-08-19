"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/actions/auth";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import { deleteImage, getStoragePath } from "@/lib/storage/delete-image";
import { uploadImage } from "@/lib/storage/upload-image";
import { validateImageFile } from "@/lib/storage/validate-image";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type ActionResponse = {
  success: boolean;
  message: string;
};

export async function createArticle(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  let uploadedImagePath: string | null = null;

  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const isHeadline = formData.get("isHeadline") === "on";

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      throw new Error("Anda harus login untuk membuat artikel.");
    }

    const loggedInUserId = session.user.id;

    const imageFile = formData.get("image") as File;
    let imageUrl = null;

    if (imageFile && imageFile.size > 0) {
      const validationError = validateImageFile(imageFile);
      if (validationError) {
        throw new Error(validationError);
      }

      const uploaded = await uploadImage(imageFile, STORAGE_BUCKETS.article);
      uploadedImagePath = uploaded.path;
      imageUrl = uploaded.url;
    }

    const slug = `${generateSlug(title)}-${Math.random().toString(36).substring(2, 7)}`;

    await prisma.article.create({
      data: {
        title,
        slug,
        category,
        excerpt,
        content,
        isHeadline,
        imageUrl,
        authorId: loggedInUserId,
        publishedDate: new Date(),
      },
    });

    return {
      success: true,
      message: "Mantap! Artikel berhasil diterbitkan.",
    };
  } catch (error: unknown) {
    if (uploadedImagePath) {
      await deleteImage(STORAGE_BUCKETS.article, uploadedImagePath).catch(
        (cleanupError) =>
          console.error("Gagal membersihkan gambar:", cleanupError),
      );
    }
    console.error("Create Article Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat membuat artikel.",
    };
  }
}

export async function deleteArticle(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (article?.imageUrl) {
      const filePath = getStoragePath(
        article.imageUrl,
        STORAGE_BUCKETS.article,
      );

      if (filePath) {
        await deleteImage(STORAGE_BUCKETS.article, filePath).catch(
          (storageError) =>
            console.error(
              "Gagal menghapus gambar dari Supabase:",
              storageError,
            ),
        );
      }
    }

    await prisma.article.delete({
      where: { id },
    });

    revalidatePath("/dashboard/articles");
    return { success: true, message: "Artikel dan gambar berhasil dihapus." };
  } catch (error) {
    console.error("Gagal menghapus artikel:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus artikel.",
    };
  }
}

export async function updateArticle(
  prevState: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  let uploadedImagePath: string | null = null;
  let oldImagePath: string | null = null;

  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const isHeadline = formData.get("isHeadline") === "on";

    const publishedDateRaw = formData.get("publishedDate") as string | null;

    let publishedDate: Date | undefined = undefined;
    if (publishedDateRaw) {
      const parsedDate = new Date(publishedDateRaw);
      if (!isNaN(parsedDate.getTime())) {
        publishedDate = parsedDate;
      }
    }

    const imageFile = formData.get("image") as File | null;
    let newImageUrl: string | undefined = undefined; // Kita gunakan

    if (imageFile && imageFile.size > 0) {
      const validationError = validateImageFile(imageFile);
      if (validationError) {
        throw new Error(validationError);
      }

      const oldArticle = await prisma.article.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (oldArticle?.imageUrl) {
        oldImagePath = getStoragePath(
          oldArticle.imageUrl,
          STORAGE_BUCKETS.article,
        );
      }

      const uploaded = await uploadImage(imageFile, STORAGE_BUCKETS.article);
      uploadedImagePath = uploaded.path;
      newImageUrl = uploaded.url;
    }

    const dataToUpdate: Prisma.ArticleUpdateInput = {
      title,
      category,
      excerpt,
      content,
      isHeadline,
      ...(publishedDate ? { publishedDate } : {}),
    };

    if (newImageUrl !== undefined) {
      dataToUpdate.imageUrl = newImageUrl;
    }

    await prisma.article.update({
      where: { id },
      data: dataToUpdate,
    });

    if (oldImagePath) {
      await deleteImage(STORAGE_BUCKETS.article, oldImagePath).catch(
        (storageError) =>
          console.error("Gagal menghapus gambar lama:", storageError),
      );
    }

    // revalidatePath("/dashboard/articles");
    // redirect("/dashboard/articles");

    return {
      success: true,
      message: "Perubahan artikel berhasil disimpan.",
    };
  } catch (error: unknown) {
    if (uploadedImagePath) {
      await deleteImage(STORAGE_BUCKETS.article, uploadedImagePath).catch(
        (cleanupError) =>
          console.error("Gagal membersihkan gambar:", cleanupError),
      );
    }
    console.error("Create Article Error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat memperbarui artikel.",
    };
  }
}
