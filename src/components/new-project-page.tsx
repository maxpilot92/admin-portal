"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2, ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import Image from "next/image";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

interface MediaItem {
  id: string;
  url: string;
  data: string;
  title: string;
}

export function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<(File | string)[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);

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

  async function fetchMedia() {
    try {
      const response = await axios.get("/api/media");
      const data = response.data.data;
      setMediaItems(data);
    } catch (error) {
      console.log("Error fetching media:", error);
    }
  }

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleSelectMedia = (media: (typeof mediaItems)[0]) => {
    setSelectedMedia(media);
    setImages((prev) => [...prev, media.url]);
    setIsMediaDialogOpen(false);
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

          <div className="grid gap-3">
            <Label className="text-base">Featured Image</Label>
            <Dialog
              open={isMediaDialogOpen}
              onOpenChange={setIsMediaDialogOpen}
            >
              <DialogTrigger asChild>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                  {selectedMedia ? (
                    <div className="space-y-2 w-full">
                      <div className="aspect-video rounded-md overflow-hidden bg-muted">
                        <Image
                          width={200}
                          height={200}
                          src={selectedMedia.url || "/placeholder.svg"}
                          alt={selectedMedia.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-center">
                        {selectedMedia.title}
                      </p>
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        No image selected
                      </p>
                      <Button variant="outline" size="sm" type="button">
                        Select from Media Library
                      </Button>
                    </>
                  )}
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Select Media</DialogTitle>
                  <DialogDescription>
                    Choose an image from your media library to use as the
                    featured image.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                  {mediaItems.map((media) => (
                    <div
                      key={media.id}
                      className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                        selectedMedia?.id === media.id
                          ? "ring-2 ring-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectMedia(media)}
                    >
                      <div className="aspect-video">
                        <Image
                          width={200}
                          height={200}
                          src={media.url || "/placeholder.svg"}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-sm truncate">{media.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </form>
    </div>
  );
}
