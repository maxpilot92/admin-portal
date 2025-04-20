import { CategoriesPage } from "@/components/categories-page";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Categories() {
  return (
    <DashboardLayout>
      <CategoriesPage categoryFor="porfolio" />
    </DashboardLayout>
  );
}
