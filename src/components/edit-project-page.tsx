"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MultiImageUpload } from "./multi-image-upload";
import axios from "axios";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  createdAt: string;
}

interface EditProjectPageProps {
  id: string;
}

export function EditProjectPage({ id }: EditProjectPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologiesString, setTechnologiesString] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch(`/api/projects/${id}`)
        // const data = await response.json()

        const response = await axios.get(`/api/portfolio?portfolioId=${id}`);

        const mockProject: Project = response.data;
        console.log(response);

        setTitle(mockProject.title);
        setDescription(mockProject.description);
        setTechnologiesString(mockProject.technologies.join(", "));
        setLiveUrl(mockProject.liveUrl);
        setRepoUrl(mockProject.repoUrl);
        setFeatured(mockProject.featured);
        setExistingImages(mockProject.images);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call with FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", technologiesString);
      formData.append("liveUrl", liveUrl);
      formData.append("repoUrl", repoUrl);
      formData.append("featured", String(featured));
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      newImages.forEach((image) => formData.append("newImages", image));

      const response = await axios.patch(
        `/api/portfolio?portfolioId=${id}`,
        formData
      );
      console.log(response);
      router.push(`/portfolio/${id}`);
    } catch (error) {
      console.error("Error updating project:", error);
      setIsSubmitting(false);
    }
  };

  const handleExistingImageDelete = (imageUrl: string) => {
    setExistingImages(existingImages.filter((img) => img !== imageUrl));
    setImagesToDelete([...imagesToDelete, imageUrl]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader heading="Edit Project" text="Update your portfolio project">
          <Button variant="outline" onClick={() => router.push("/portfolio")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </PageHeader>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Edit Project" text="Update your portfolio project">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/portfolio/${id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Update Project
              </>
            )}
          </Button>
        </div>
      </PageHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title" className="text-base">
                  Project Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description" className="text-base">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in detail..."
                  className="min-h-[200px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="technologies" className="text-base">
                    Technologies
                  </Label>
                  <Input
                    id="technologies"
                    placeholder="React, Node.js, MongoDB, etc. (comma separated)"
                    value={technologiesString}
                    onChange={(e) => setTechnologiesString(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter technologies used, separated by commas.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="liveUrl" className="text-base">
                    Live Demo URL
                  </Label>
                  <Input
                    id="liveUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="repoUrl" className="text-base">
                    Repository URL
                  </Label>
                  <Input
                    id="repoUrl"
                    type="url"
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={setFeatured}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label className="text-base">Project Images</Label>
                  <MultiImageUpload
                    images={newImages}
                    onChange={setNewImages}
                    existingImages={existingImages}
                    onExistingImageDelete={handleExistingImageDelete}
                    maxFiles={5}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload up to 5 images. The first image will be used as the
                    thumbnail.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
