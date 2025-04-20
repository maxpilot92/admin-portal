"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Testimonial } from "@/app/(pages)/testimonials/page";

interface TestimonialFormProps {
  testimonial: Testimonial | null;
  onSubmit: (data: Omit<Testimonial, "id" | "createdAt">) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function TestimonialForm({
  testimonial,
  onSubmit,
  isSubmitting,
  onCancel,
}: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: testimonial?.name || "",
    role: testimonial?.role || "",
    description: testimonial?.description || "",
    image: testimonial?.image || "",
  });
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pt-6 px-5 overflow-y-auto"
    >
      <div className="space-y-2">
        <div className="flex justify-center mb-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.image || ""} alt={formData.name} />
            <AvatarFallback className="text-lg">
              {formData.name
                ? formData.name.substring(0, 2).toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="space-y-1">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="role" className="text-sm font-medium">
            Role <span className="text-destructive">*</span>
          </Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? "border-destructive" : ""}
          />
          {errors.role && (
            <p className="text-xs text-destructive">{errors.role}</p>
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
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter testimonial content..."
            className="min-h-[120px]"
          />
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
              {testimonial ? "Updating..." : "Creating..."}
            </>
          ) : testimonial ? (
            "Update Testimonial"
          ) : (
            "Create Testimonial"
          )}
        </Button>
      </div>
    </form>
  );
}
