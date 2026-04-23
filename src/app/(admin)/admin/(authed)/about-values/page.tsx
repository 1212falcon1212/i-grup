import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { AboutValuesClient } from "./AboutValuesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hakkımızda Kartları",
  robots: { index: false, follow: false },
};

export default async function AboutValuesPage() {
  const values = await prisma.aboutValue.findMany({
    orderBy: { order: "asc" },
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title="Hakkımızda Kartları"
        description="Ana sayfadaki Hakkımızda bölümünde sağda görünen değer kartları. Drag-drop ile sıralayın."
      />
      <AboutValuesClient
        initial={values.map((v) => ({
          id: v.id,
          eyebrow: v.eyebrow,
          title: v.title,
          description: v.description,
          order: v.order,
          isActive: v.isActive,
        }))}
      />
    </div>
  );
}
