import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { auth, signOut } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/ui/logoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Cek sesi user saat ini
  const session = await auth();

  // Jika tidak ada session (belum login), tendang ke halaman login
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex max-h-screen min-h-screen bg-gray-50 text-slate-900">
      {/* Sidebar - Navy Blue (#0f172a) */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <h1 className="text-xl font-bold tracking-wider text-white">
            HISTORA POST
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </Link>
          <Link
            href="/dashboard/articles"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <FileText size={20} />
            <span className="font-medium">Artikel Berita</span>
          </Link>
          {/* Menu Manajemen Pengguna hanya untuk Admin */}
          {session.user.role === "ADMIN" && (
            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Users size={20} />
              <span className="font-medium">Manajemen Pengguna</span>
            </Link>
          )}
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Settings size={20} />
            <span className="font-medium">Ganti Password</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <LogoutButton />
          {/* <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            
          </form> */}
        </div>
      </aside>

      {/* Main Content - White */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="text-sm text-right">
              {/* Tampilkan nama dan role dinamis */}
              <p className="font-semibold text-slate-900">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-500">{session.user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-[#0f172a] font-bold">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
