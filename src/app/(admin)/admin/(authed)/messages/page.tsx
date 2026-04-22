import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mesajlar", robots: { index: false } };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const where = params.filter === "unread" ? { isRead: false } : {};
  const messages = await prisma.contactMessage.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title="İletişim Mesajları"
        description="Web sitesi üzerinden gönderilen mesajlar."
      />
      <MessagesClient
        activeFilter={params.filter ?? "all"}
        items={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          subject: m.subject,
          message: m.message,
          isRead: m.isRead,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
