"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const EyeIcon = ({ isOpen }: { isOpen: boolean }) => {
  if (isOpen) {
    return (
      <svg
        className="w-5 h-5 text-slate-500 hover:text-slate-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    );
  }

  return (
    <svg
      className="w-5 h-5 text-slate-500 hover:text-slate-700"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Token reset password tidak ditemukan atau tidak valid.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("Password baru dan konfirmasi password tidak cocok!");
      return;
    }

    if (newPassword.length < 6) {
      setStatus("error");
      setMessage("Password minimal harus 6 karakter.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Password berhasil diubah! Mengalihkan ke halaman login...");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Gagal mengubah password.");
      }
    } catch (error) {
      console.error("Error saat reset password:", error);
      setStatus("error");
      setMessage("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 sm:p-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Buat Password Baru
        </h1>
        <p className="text-sm text-slate-500">
          Silakan masukkan password baru Anda. Pastikan password kuat dan mudah
          diingat.
        </p>
      </div>

      {/* Notifikasi Pesan */}
      {status === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Password Baru */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={status === "loading" || status === "success"}
              className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              tabIndex={-1}
            >
              <EyeIcon isOpen={showPassword} />
            </button>
          </div>
        </div>

        {/* Input Konfirmasi Password */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={status === "loading" || status === "success"}
              className={`w-full pl-4 pr-12 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                confirmPassword.length > 0 && newPassword !== confirmPassword
                  ? "border-red-400 focus:ring-red-500"
                  : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
              tabIndex={-1}
            >
              <EyeIcon isOpen={showConfirmPassword} />
            </button>
          </div>
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Password tidak cocok.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {status === "loading" ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Batal & Kembali ke Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className=" flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="text-slate-500 animate-pulse">Memuat halaman...</div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
