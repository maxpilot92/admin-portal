"use client";

import type React from "react";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { MarkdownPreview } from "@/components/markdown-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamMember, TeamMemberFormData } from "@/app/(pages)/team/page";

interface TeamMemberFormProps {
  member: TeamMember | null;
  onSubmit: (data: TeamMemberFormData) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function TeamMemberForm({
  member,
  onSubmit,
  isSubmitting,
  onCancel,
}: TeamMemberFormProps) {
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: member?.name || "",
    role: member?.role || "",
    image: member?.image || "",
    description: member?.description || "",
  });

  const [activeTab, setActiveTab] = useState<string>("write");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name" className="required">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role" className="required">
            Role
          </Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
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
                placeholder="Enter description (markdown supported)"
                className="min-h-[120px]"
              />
            </TabsContent>
            <TabsContent value="preview" className="mt-2">
              <div className="border rounded-md p-4 min-h-[120px] bg-muted/30">
                {formData.description ? (
                  <MarkdownPreview content={formData.description} />
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
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {member ? "Updating..." : "Creating..."}
            </>
          ) : member ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
