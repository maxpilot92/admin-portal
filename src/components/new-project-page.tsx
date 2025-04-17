"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { MultiImageUpload } from "@/components/multi-image-upload";
import axios from "axios";

export function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call with FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("technologies", technologies);
      formData.append("liveUrl", liveUrl);
      formData.append("repoUrl", repoUrl);
      formData.append("featured", String(featured));
      images.forEach((image) => formData.append("images", image));

      console.log(formData);
      await axios.post("/api/portfolio", formData);

      router.push("/portfolio");
    } catch (error) {
      console.error("Error creating project:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Create New Project"
        text="Add a new project to your portfolio"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/portfolio")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
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
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
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
                    images={images}
                    onChange={setImages}
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
