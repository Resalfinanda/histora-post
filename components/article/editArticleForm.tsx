"use client";

import { useFormStatus } from "react-dom";
import { updateArticle } from "@/app/actions/article";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  success: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-[#0f172a] hover:bg-slate-800 text-white gap-2"
    >
      <Save size={16} />
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  );
}

export function EditArticleForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(updateArticle, initialState);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);

      // redirect setelah 1.5 detik
      setTimeout(() => {
        router.push("/dashboard/articles");
      }, 1500);
    } else {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {children}

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <SubmitButton />
      </div>
    </form>
  );
}