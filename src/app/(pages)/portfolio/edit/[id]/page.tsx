"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EditProjectPage } from "@/components/edit-project-page";
import { useParams } from "next/navigation";

export default function EditProject() {
  const params = useParams();
  const id = params.id as string;
  return (
    <DashboardLayout>
      <EditProjectPage id={id} />
    </DashboardLayout>
  );
}
