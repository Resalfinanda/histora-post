import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import AdvertisementForm from "../advertisementForm";

interface EditAdvertisementPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdvertisementPage({
  params,
}: EditAdvertisementPageProps) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Iklan</h1>
      <AdvertisementForm id={id} />
    </div>
  );
}
