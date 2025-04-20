"use client";

import type React from "react";

import { useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseCase, UseCaseFormData } from "@/app/(pages)/use-case/page";
import Image from "next/image";

interface UseCaseFormProps {
  useCase: UseCase | null;
  onSubmit: (data: UseCaseFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function UseCaseForm({
  useCase,
  onSubmit,
  isSubmitting,
  onCancel,
}: UseCaseFormProps) {
  const [formData, setFormData] = useState<UseCaseFormData>({
    title: useCase?.title || "",
    description: useCase?.description || "",
    image: useCase?.image || "",
  });
  const [activeTab, setActiveTab] = useState<string>("write");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    if (!url) return true; // Empty URLs are valid (optional field)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {formData.image ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              height={300}
              width={300}
              src={formData.image || "/placeholder.svg"}
              alt="Use case preview"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-lg border bg-muted/20">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="mb-2 h-10 w-10" />
              <span>No image</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="image" className="text-sm font-medium">
            Image URL
          </Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={errors.image ? "border-destructive" : ""}
          />
          {errors.image && (
            <p className="text-xs text-destructive">{errors.image}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-destructive">*</span>
          </Label>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="mt-2">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description of the use case"
                className="min-h-[200px]"
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description}
                </p>
              )}
            </TabsContent>
            <TabsContent value="preview" className="mt-2">
              <div className="border rounded-md p-4 min-h-[200px] prose dark:prose-invert max-w-none">
                {formData.description ? (
                  <p>{formData.description}</p>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No description provided
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {useCase ? "Updating..." : "Creating..."}
            </>
          ) : useCase ? (
            "Update Use Case"
          ) : (
            "Create Use Case"
          )}
        </Button>
      </div>
    </form>
  );
}
