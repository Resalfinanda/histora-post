"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { auth } from "@/app/actions/auth";

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

    const MAX_FILE_SIZE = 1 * 1024 * 1024;

    if (imageFile && imageFile.size > 0) {
      // Penjagaan Server-Side
      if (imageFile.size > MAX_FILE_SIZE) {
        throw new Error("Upload gagal: Ukuran gambar melebihi batas 1 MB.");
      }
      // Bersihkan nama file dan buat unik
      const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.\-]/g, "");
      const uniqueFilename = `${Date.now()}-${cleanFileName}`;

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { data, error } = await supabase.storage
        .from("article-images")
        .upload(`${uniqueFilename}`, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase Upload Error:", error);
        throw new Error(`Upload gagal: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(`${uniqueFilename}`);

      imageUrl = publicUrlData.publicUrl;
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
      const filePathParts = article.imageUrl.split("/article-images/");

      if (filePathParts.length > 1) {
        const filePath = filePathParts[1];

        const { error: storageError } = await supabase.storage
          .from("article-images")
          .remove([filePath]);

        if (storageError) {
          console.error("Gagal menghapus gambar dari Supabase:", storageError);
        }
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
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const isHeadline = formData.get("isHeadline") === "on";

    const imageFile = formData.get("image") as File | null;
    let newImageUrl: string | undefined = undefined; // Kita gunakan

    if (imageFile && imageFile.size > 0) {
      const MAX_FILE_SIZE = 1 * 1024 * 1024;
      if (imageFile.size > MAX_FILE_SIZE) {
        throw new Error("Upload gagal: Ukuran gambar melebihi batas 1 MB.");
      }

      const oldArticle = await prisma.article.findUnique({
        where: { id },
        select: { imageUrl: true },
      });

      if (oldArticle?.imageUrl) {
        const filePathParts = oldArticle.imageUrl.split("/article-images/");
        if (filePathParts.length > 1) {
          await supabase.storage
            .from("article-images")
            .remove([filePathParts[1]]);
        }
      }

      const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.\-]/g, "");
      const uniqueFilename = `${Date.now()}-${cleanFileName}`;

      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const { error } = await supabase.storage
        .from("article-images")
        .upload(`${uniqueFilename}`, buffer, {
          contentType: imageFile.type,
          upsert: false,
        });

      if (error) throw new Error(`Supabase Error: ${error.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("article-images")
        .getPublicUrl(`${uniqueFilename}`);

      newImageUrl = publicUrlData.publicUrl;
    }

    const dataToUpdate: Prisma.ArticleUpdateInput = {
      title,
      category,
      excerpt,
      content,
      isHeadline,
    };

    if (newImageUrl !== undefined) {
      dataToUpdate.imageUrl = newImageUrl;
    }

    await prisma.article.update({
      where: { id },
      data: dataToUpdate,
    });

    // revalidatePath("/dashboard/articles");
    // redirect("/dashboard/articles");

    return {
      success: true,
      message: "Perubahan artikel berhasil disimpan.",
    };
  } catch (error: unknown) {
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
