"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentFormProps {
  articleId: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ articleId, onCommentAdded }: CommentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); 

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          ...formData,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", content: "" });
        onCommentAdded?.();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Gagal mengirim komentar");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setErrorMessage("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-transparent p-6 rounded-lg">
      <h3 className="text-lg font-bold text-foreground mb-4">Komentar Anda</h3>

      {errorMessage && (
        <div className="mb-4 p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/50 rounded-md">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground/50 mb-1"
          >
            Nama Anda
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Nama"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            maxLength={30} 
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground/50 mb-1"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Email Anda"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-foreground/50 mb-1"
          >
            Tulis Komentar...
          </label>
          <textarea
            id="content"
            placeholder="Tulis komentar Anda di sini..."
            rows={5}
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            required
            maxLength={500} 
            className="w-full px-3 py-2 rounded-lg border border-input bg-transparent text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-foreground text-background"
        >
          {isLoading ? "Mengirim..." : "Kirim Komentar"}
        </Button>
      </div>
    </form>
  );
}
