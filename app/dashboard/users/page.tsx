import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Shield, User as UserIcon } from "lucide-react";
import { auth } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { DeleteUserButton } from "@/components/ui/deleteUserButton";

export default async function ManageUsersPage() {
  const session = await auth();

  // Proteksi Halaman: Tendang keluar jika bukan ADMIN
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Ambil semua user beserta jumlah artikel yang mereka buat
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { articles: true }, // Menghitung relasi artikel (pastikan nama relasinya 'articles' di schema.prisma)
      },
    },
    orderBy: { role: "asc" }, // Tampilkan Admin di atas, lalu Redaktur
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0f172a]">Kelola Pengguna</h2>
          <p className="text-slate-500 text-sm mt-1">
            Atur akses Admin dan Redaktur Histora Post.
          </p>
        </div>
        <Link href="/dashboard/users/create">
          <Button className="bg-[#0f172a] text-white hover:bg-slate-800 gap-2">
            <Plus size={16} />
            Tambah Pengguna Baru
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama & Email</th>
                <th className="px-6 py-4">Role Hak Akses</th>
                <th className="px-6 py-4 text-center">Total Artikel</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-slate-500 text-xs">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}
                    >
                      {user.role === "ADMIN" ? (
                        <Shield size={12} />
                      ) : (
                        <UserIcon size={12} />
                      )}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                      {user._count.articles}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Jangan tampilkan tombol hapus untuk diri sendiri */}
                    {session.user?.id !== user.id && (
                      <DeleteUserButton
                        userId={user.id}
                        userName={user.name || "User"}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
