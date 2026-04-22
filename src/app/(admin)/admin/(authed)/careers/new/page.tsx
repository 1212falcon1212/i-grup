import { PageHeader } from "@/components/admin/PageHeader";
import { CareerForm } from "@/components/admin/forms/CareerForm";

export const metadata = { title: "Yeni İlan", robots: { index: false } };

export default function NewCareerPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Yeni İlan" description="Yeni bir iş ilanı oluşturun." />
      <CareerForm />
    </div>
  );
}
