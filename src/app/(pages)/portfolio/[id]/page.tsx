"use client";
import { DashboardLayout } from "@/components/dashboard-layout";
import { ProjectDetailsPage } from "@/components/project-details-page";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const params = useParams();
  const id = params.id as string;
  return (
    <DashboardLayout>
      <ProjectDetailsPage id={id} />
    </DashboardLayout>
  );
}
