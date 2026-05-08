"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Advertisement {
  id: string;
  title: string;
  placement: string;
  topics: string[];
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  clicks: number;
  impressions: number;
  createdAt: string;
}

export default function AdvertisementsClient() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/advertisements");
      if (!response.ok) throw new Error("Failed to fetch ads");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Gagal memuat iklan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/advertisements/${deleteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghapus iklan");
      }

      setAds(ads.filter((ad) => ad.id !== deleteId));
      toast.success("Iklan berhasil dihapus");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting ad:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus iklan";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async (ad: Advertisement) => {
    try {
      const response = await fetch(`/api/advertisements/${ad.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal memperbarui iklan");
      }

      setAds(
        ads.map((a) => (a.id === ad.id ? { ...a, isActive: !a.isActive } : a)),
      );
      toast.success(!ad.isActive ? "Iklan diaktifkan" : "Iklan dinonaktifkan");
    } catch (error) {
      console.error("Error updating ad:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memperbarui iklan";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Iklan</h1>
        <Link href="/dashboard/advertisements/create">
          <Button>Tambah Iklan</Button>
        </Link>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Belum ada iklan</p>
          <Link href="/dashboard/advertisements/create">
            <Button>Buat Iklan Pertama</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-700">
              <TableRow >
                <TableHead className="text-white font-bold text-center uppercase">Judul</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Penempatan</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Topik</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Status</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Tanggal Mulai</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Tanggal Berakhir</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Klik</TableHead>
                <TableHead className="text-white font-bold text-center uppercase">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium text-start">{ad.title}</TableCell>
                  <TableCell>{ad.placement}</TableCell>
                  <TableCell >
                    <div className="flex flex-wrap gap-1 pl-4">
                      {ad.topics && ad.topics.length > 0 ? (
                        ad.topics.map((topic) => (
                          <span
                            key={topic}
                            className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {topic}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(ad)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        ad.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ad.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </TableCell>
                  <TableCell>
                    {ad.startDate
                      ? new Date(ad.startDate).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {ad.endDate
                      ? new Date(ad.endDate).toLocaleDateString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>{ad.clicks}</TableCell>
                  <TableCell className="space-x-2">
                    <Link href={`/dashboard/advertisements/${ad.id}`}>
                      <Button variant="outline" size="sm" >
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-400 hover:bg-red-700 hover:text-white"
                      onClick={() => setDeleteId(ad.id)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Iklan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus iklan ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-4">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
