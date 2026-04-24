"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Menu,
  X,
} from "lucide-react";
import { Session } from "next-auth";
import { LogoutButton } from "@/components/ui/logoutButton";

export default function DashboardClientLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAdmin = session.user.role === "ADMIN";

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen max-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ✅ HEADER MOBILE */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-40">
        <h1 className="font-bold text-lg text-[#0f172a]">Historapost</h1>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 bg-slate-100 rounded-md"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* ✅ OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ✅ SIDEBAR */}
      <aside
        className={`
        fixed md:relative inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-white flex flex-col
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Header Sidebar */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700/50">
          <h1 className="text-xl font-bold">Historapost</h1>
          <button onClick={closeSidebar} className="md:hidden text-slate-300">
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800"
          >
            <LayoutDashboard size={20} />
            Overview
          </Link>

          <Link
            href="/dashboard/articles"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800"
          >
            <FileText size={20} />
            Artikel
          </Link>

          {isAdmin && (
            <Link
              href="/dashboard/users"
              onClick={closeSidebar}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800"
            >
              <Users size={20} />
              Manajemen Pengguna
            </Link>
          )}

          <Link
            href="/dashboard/settings"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800"
          >
            <Settings size={20} />
            Pengaturan
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <LogoutButton />
        </div>
      </aside>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 flex flex-col w-full">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-xs text-slate-500">{session.user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0f172a]">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
