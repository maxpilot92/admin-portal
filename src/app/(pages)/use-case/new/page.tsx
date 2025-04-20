"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UseCaseForm } from "@/components/use-case-form";
import { UseCaseFormData } from "../page";

export default function NewUseCasePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: UseCaseFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/use-case", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create use case");

      router.push("/use-case");
    } catch (error) {
      console.error("Error creating use case:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          heading="Create New Use Case"
          text="Add a new portfolio use case"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/use-cases")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit" form="use-case-form">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Use Case
                </>
              )}
            </Button>
          </div>
        </PageHeader>

        <Card>
          <CardContent className="pt-6">
            <UseCaseForm
              useCase={null}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onCancel={() => router.push("/use-cases")}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
