// app/(dashboard)/dashboard/articles/create/page.tsx
import Link from "next/link";
import { ArrowLeft} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EditorWrapper } from "@/components/editor/editorWrapper";
import { ImageUpload } from "@/components/ui/image-upload";
import { CreateArticleForm } from "@/components/article/createArticleForm";

// type CreateArticlePageProps = {
//   category: string;
// };

export default async function CreateArticlePage() {
  // const categories = await prisma.article.findMany({
  //   select: { category: true },
  //   distinct: ["category"],
  // });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/articles">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#0f172a]">
              Tulis Artikel Baru
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Buat publikasi berita baru untuk Histora Post.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        {/* Hubungkan form dengan Server Action */}
        <CreateArticleForm>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Judul Artikel</Label>
              <Input
                id="title"
                name="title"
                placeholder="Masukkan judul berita..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              {/* <select name="category" defaultValue="category"> */}
              <select name="category">
                <option value="Sosial">Sosial</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Nasional">Nasional</option>
                <option value="Ekonomi">Ekonomi</option>
                <option value="UMKM">UMKM</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Budaya">Budaya</option>
                <option value="Politik">Politik</option>
                <option value="Arsip">Arsip</option>

                {/* {categories.map((c) => (
                  <option key={c.category} value={c.category}>
                    {c.category}
                  </option>
                ))} */}
              </select>
            </div>

            <div className="space-y-2 flex flex-col justify-end pb-2">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHeadline"
                  className="w-4 h-4 accent-[#0f172a]"
                />
                Jadikan sebagai Headline Utama
              </Label>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Gambar Sampul (Cover Image)</Label>
              <ImageUpload name="image" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="excerpt">Ringkasan Singkat (Excerpt)</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                placeholder="Tulis ringkasan singkat yang akan muncul di halaman depan..."
                rows={2}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">Isi Konten Berita</Label>
              <EditorWrapper name="content" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/dashboard/articles">
              <Button type="button" variant="outline">
                Batal
              </Button>
            </Link>
            {/* <Button
              type="submit"
              className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2"
            >
              <Save size={16} />
              Publish Artikel
            </Button> */}
          </div>
        </CreateArticleForm>
      </div>
    </div>
  );
}
