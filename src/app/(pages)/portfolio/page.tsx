import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";

export default function PortfolioPage() {
  return (
    <DashboardLayout>
      <PageHeader
        heading="Portfolio"
        text="Manage your portfolio projects and showcases"
      />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold">Portfolio Content</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This is a placeholder for the Portfolio page content. You can add your
          portfolio management features here.
        </p>
      </div>
    </DashboardLayout>
  );
}
