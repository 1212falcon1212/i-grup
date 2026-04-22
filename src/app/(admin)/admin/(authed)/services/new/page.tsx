import { PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";

export const metadata = { title: "Yeni Hizmet", robots: { index: false } };

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Yeni Hizmet" description="Yeni bir hizmet kaydı oluşturun." />
      <ServiceForm />
    </div>
  );
}
