import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import AdvertisementForm from "../advertisementForm";

export default async function CreateAdvertisementPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Buat Iklan Baru</h1>
      <AdvertisementForm />
    </div>
  );
}
