"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, ImageIcon, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import axios from "axios";

interface MediaItem {
  id: string;
  title: string;
  url: string;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await axios.get("/api/media");
        setMediaItems(response.data.data);
      } catch (error) {
        console.error("Error fetching media items:", error);
      }
    };
    fetchMediaItems();
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/service?serviceId=${serviceId}`);
        if (!response.ok) throw new Error("Failed to fetch service");

        const service = await response.json();

        setFormData({
          title: service.title || "",
          description: service.description || "",
          image: service.image || "",
        });

        if (service.image) {
          setSelectedMedia({
            id: "custom",
            title: service.title,
            url: service.image,
          });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setFormData((prev) => ({ ...prev, image: media.url }));
    setIsMediaDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/service?serviceId=${serviceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update service");

      router.push("/services");
    } catch (error) {
      console.error("Error updating service:", error);
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
          heading="Edit Service"
          text="Update your service information"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/services")}>
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
                  Update Service
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
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter service title"
                    className="text-lg"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description" className="text-base">
                    Description
                  </Label>
                  <Tabs defaultValue="write" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write" className="mt-2">
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Write your service description here..."
                        className="min-h-[200px]"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-2">
                      <div className="border rounded-md p-4 min-h-[200px] prose dark:prose-invert max-w-none">
                        {formData.description ? (
                          <p>{formData.description}</p>
                        ) : (
                          <p className="text-muted-foreground">
                            Description preview will appear here...
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label className="text-base">Service Image</Label>
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
                                width={400}
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
                          Choose an image from your media library to use for
                          this service.
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
                                width={400}
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

                <div className="grid gap-3">
                  <Label htmlFor="image-url" className="text-base">
                    Image URL
                  </Label>
                  <Input
                    id="image-url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter a direct URL to an image or select one from your media
                    library.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
