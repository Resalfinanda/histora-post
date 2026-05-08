import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import AdvertisementsClient from "./advertisementsClient";

export default async function AdvertisementsPage() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return <AdvertisementsClient />;
}
