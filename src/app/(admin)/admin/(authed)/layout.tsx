import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";

export default async function AdminAuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar userName={session.user.name ?? session.user.email ?? "Admin"} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
