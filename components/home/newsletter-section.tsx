"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmail("");

      toast.info("Fitur belum tersedia", {
        description:
          "Saat ini fitur newsletter belum tersedia. Silakan coba lagi nanti.",
      });
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Gagal memproses langganan.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-linear-to-r from-blue-50 to-blue-100 rounded-lg p-8 my-12">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-gray-800">Newsletter</h3>
        </div>

        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-4">
            Dapatkan berita terbaru setiap minggu langsung di inbox Anda.
          </p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="Email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-gray-400"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary"
            >
              {isLoading ? "Loading..." : "Langganan"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}