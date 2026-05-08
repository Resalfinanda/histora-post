"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";

const AD_PLACEMENTS = [
  "ARTICLE_HEADER",
  "ARTICLE_MIDDLE",
  "ARTICLE_FOOTER",
  "SIDEBAR_TOP",
  "SIDEBAR_MIDDLE",
  "SIDEBAR_BOTTOM",
  "HOMEPAGE_BANNER",
  "SEARCH_RESULTS",
];

const AD_TOPICS = [
  "SPORTS",
  "LOCAL_EVENTS",
  "POLITICS",
  "BUSINESS",
  "TECHNOLOGY",
  "ENTERTAINMENT",
  "HEALTH",
  "EDUCATION",
  "GENERAL",
];

interface AdvertisementFormProps {
  id?: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  adLink: string;
  placement: string;
  topics: string[];
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number;
}

export default function AdvertisementForm({ id }: AdvertisementFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    imageUrl: "",
    adLink: "",
    placement: "ARTICLE_HEADER",
    topics: [],
    isActive: true,
    startDate: "",
    endDate: "",
    priority: 0,
  });

  useEffect(() => {
    if (id) {
      fetchAdvertisement();
    }
  }, [id]);

  const fetchAdvertisement = async () => {
    try {
      const response = await fetch(`/api/advertisements/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memuat data iklan");
      }
      const data = await response.json();

      setFormData({
        title: data.title || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        adLink: data.adLink || "",
        placement: data.placement || "ARTICLE_HEADER",
        topics: data.topics || [],
        isActive: data.isActive ?? true,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString().split("T")[0]
          : "",
        endDate: data.endDate
          ? new Date(data.endDate).toISOString().split("T")[0]
          : "",
        priority: data.priority || 0,
      });
    } catch (error) {
      console.error("Error fetching ad:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memuat data iklan";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      placement: value,
    }));
  };

  const toggleTopic = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fileInput = form.elements.namedItem("imageUrl") as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!formData.title || !formData.adLink || (!formData.imageUrl && !file)) {
      toast.error("Silakan isi semua field yang wajib");
      return;
    }

    try {
      setIsSubmitting(true);
      const method = id ? "PUT" : "POST";
      const endpoint = id ? `/api/advertisements/${id}` : "/api/advertisements";

      let imageUrl = formData.imageUrl;
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.json();
          throw new Error(uploadError.error || "Gagal upload gambar");
        }
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan iklan");
      }

      toast.success(id ? "Iklan berhasil diperbarui" : "Iklan berhasil dibuat");
      router.push("/dashboard/advertisements");
    } catch (error) {
      console.error("Error saving ad:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menyimpan iklan";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Memuat...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {/* Judul */}
      <div>
        <Label htmlFor="title">Judul Iklan *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Masukkan judul iklan"
          required
        />
      </div>

      {/* Deskripsi */}
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Masukkan deskripsi iklan (opsional)"
          rows={4}
        />
      </div>

      {/* Gambar */}
      <div>
        <Label>Gambar Iklan *</Label>
        <ImageUpload name="imageUrl" defaultValue={formData.imageUrl} />
      </div>

      {/* Link Iklan */}
      <div>
        <Label htmlFor="adLink">Link Iklan *</Label>
        <Input
          id="adLink"
          name="adLink"
          type="url"
          value={formData.adLink}
          onChange={handleInputChange}
          placeholder="https://example.com"
          required
        />
      </div>

      {/* Penempatan */}
      <div>
        <Label htmlFor="placement">Penempatan *</Label>
        <Select value={formData.placement} onValueChange={handleSelectChange}>
          <SelectTrigger id="placement">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AD_PLACEMENTS.map((placement) => (
              <SelectItem key={placement} value={placement}>
                {placement.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topik */}
      <div>
        <Label>Topik</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {AD_TOPICS.map((topic) => (
            <label key={topic} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.topics.includes(topic)}
                onChange={() => toggleTopic(topic)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">{topic.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Prioritas */}
      <div>
        <Label htmlFor="priority">Prioritas</Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          value={formData.priority}
          onChange={handleInputChange}
          placeholder="0"
        />
      </div>

      {/* Tanggal Mulai */}
      <div>
        <Label htmlFor="startDate" className="mb-2">
          Tanggal Mulai
        </Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleInputChange}
        />
      </div>

      {/* Tanggal Berakhir */}
      <div>
        <Label htmlFor="endDate" className="mb-2">
          Tanggal Berakhir
        </Label>
        <Input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleInputChange}
        />
      </div>

      {/* Status */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleInputChange}
          className="w-4 h-4 rounded"
        />
        <Label htmlFor="isActive" className="mb-0">
          Aktifkan Iklan
        </Label>
      </div>

      {/* Tombol */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting
            ? id
              ? "Memperbarui..."
              : "Membuat..."
            : id
              ? "Perbarui Iklan"
              : "Buat Iklan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
