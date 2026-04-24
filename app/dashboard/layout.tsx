// app/dashboard/layout.tsx
import { auth } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import DashboardClientLayout from "./dashboardClientlayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardClientLayout session={session}>
      {children}
    </DashboardClientLayout>
  );
}