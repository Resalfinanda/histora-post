// app/(public)/login/page.tsx
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  
  // Jika sudah login, cegah masuk ke halaman login, arahkan ke dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#0f172a]">Login Histora Post</h1>
          <p className="text-sm text-slate-500 mt-2">Masuk ke dashboard untuk mengelola berita.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 text-center">
            Email atau password salah. Silakan coba lagi.
          </div>
        )}

        <form 
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }} 
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="admin@historapost.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          <Button type="submit" className="w-full bg-[#0f172a] hover:bg-slate-800 text-white">
            Masuk Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}