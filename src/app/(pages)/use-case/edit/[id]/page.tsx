"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UseCaseForm } from "@/components/use-case-form";
import { UseCase, UseCaseFormData } from "../../page";

export default function EditUseCasePage() {
  const router = useRouter();
  const params = useParams();
  const useCaseId = params.id as string;

  const [useCase, setUseCase] = useState<UseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUseCase = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/use-case?usecaseId=${useCaseId}`);
        if (!response.ok) throw new Error("Failed to fetch use case");
        const data = await response.json();

        setUseCase(data.data[0]);
      } catch (error) {
        console.error("Error fetching use case:", error);
        router.push("/use-case");
      } finally {
        setIsLoading(false);
      }
    };

    if (useCaseId) {
      fetchUseCase();
    }
  }, [useCaseId, router]);

  const handleSubmit = async (formData: UseCaseFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/use-case?usecaseId=${useCaseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update use case");

      router.push("/use-case");
    } catch (error) {
      console.error("Error updating use case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          heading="Edit Use Case"
          text="Update your portfolio use case"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/use-case")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit" form="use-case-form">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Use Case
                </>
              )}
            </Button>
          </div>
        </PageHeader>

        <Card>
          <CardContent className="pt-6">
            {useCase && (
              <UseCaseForm
                useCase={useCase}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push("/use-case")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
