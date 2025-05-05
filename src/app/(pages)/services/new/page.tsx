"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import axios from "axios";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "../../blog/new/page";
import useCategory from "@/hooks/useCategory";

interface MediaItem {
  id: string;
  title: string;
  url: string;
}

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [isCursor1DialogOpen, setIsCursor1DialogOpen] = useState(false);
  const [isCursor2DialogOpen, setIsCursor2DialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [selectedCursor1, setSelectedCursor1] = useState<MediaItem | null>(
    null
  );
  const [selectedCursor2, setSelectedCursor2] = useState<MediaItem | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    categoryId: "",
    cursor1: "",
    cursor2: "",
  });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>();
  const categoriesData = useCategory({ categoryFor: "service" });

  useEffect(() => {
    (async () => {
      const data = await categoriesData;
      setCategories(data);
    })();
  }, []);

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
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    setFormData((prev) => ({ ...prev, image: media.url }));
    setIsMediaDialogOpen(false);
  };

  const handleSelectCursor1 = (media: MediaItem) => {
    setSelectedCursor1(media);
    setFormData((prev) => ({ ...prev, cursor1: media.url }));
    setIsCursor1DialogOpen(false);
  };

  const handleSelectCursor2 = (media: MediaItem) => {
    setSelectedCursor2(media);
    setFormData((prev) => ({ ...prev, cursor2: media.url }));
    setIsCursor2DialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create service");

      router.push("/services");
    } catch (error) {
      console.error("Error creating service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          heading="Create New Service"
          text="Create and publish a new service offering"
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
                  Creating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Create Service
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
            <CardContent>
              <div className="grid gap-3">
                <Label htmlFor="category" className="text-base">
                  Category
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                                width={300}
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
                                width={300}
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

          <Card>
            <CardContent>
              <div className="grid gap-3">
                <Label className="text-base">Cursor 1</Label>
                <Dialog
                  open={isCursor1DialogOpen}
                  onOpenChange={setIsCursor1DialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      {selectedCursor1 ? (
                        <div className="space-y-2 w-full">
                          <div className="aspect-video rounded-md overflow-hidden bg-muted">
                            <Image
                              width={200}
                              height={200}
                              src={selectedCursor1.url || "/placeholder.svg"}
                              alt={selectedCursor1.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-center">
                            {selectedCursor1.title}
                          </p>
                          <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                          >
                            Change Cursor
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            No cursor selected
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
                      <DialogTitle>Select Cursor 1</DialogTitle>
                      <DialogDescription>
                        Choose an image from your media library to use as cursor
                        1.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {mediaItems.map((media) => (
                        <div
                          key={media.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                            selectedCursor1?.id === media.id
                              ? "ring-2 ring-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleSelectCursor1(media)}
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

                <div className="grid gap-3">
                  <Label htmlFor="cursor1-url" className="text-base">
                    Cursor 1 URL
                  </Label>
                  <Input
                    id="cursor1-url"
                    name="cursor1"
                    placeholder="https://example.com/cursor1.png"
                    value={formData.cursor1}
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

          <Card>
            <CardContent>
              <div className="grid gap-3">
                <Label className="text-base">Cursor 2</Label>
                <Dialog
                  open={isCursor2DialogOpen}
                  onOpenChange={setIsCursor2DialogOpen}
                >
                  <DialogTrigger asChild>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      {selectedCursor2 ? (
                        <div className="space-y-2 w-full">
                          <div className="aspect-video rounded-md overflow-hidden bg-muted">
                            <Image
                              width={200}
                              height={200}
                              src={selectedCursor2.url || "/placeholder.svg"}
                              alt={selectedCursor2.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-medium text-center">
                            {selectedCursor2.title}
                          </p>
                          <Button
                            variant="outline"
                            className="w-full"
                            type="button"
                          >
                            Change Cursor
                          </Button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            No cursor selected
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
                      <DialogTitle>Select Cursor 2</DialogTitle>
                      <DialogDescription>
                        Choose an image from your media library to use as cursor
                        2.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      {mediaItems.map((media) => (
                        <div
                          key={media.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all ${
                            selectedCursor2?.id === media.id
                              ? "ring-2 ring-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => handleSelectCursor2(media)}
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

                <div className="grid gap-3">
                  <Label htmlFor="cursor2-url" className="text-base">
                    Cursor 2 URL
                  </Label>
                  <Input
                    id="cursor2-url"
                    name="cursor2"
                    placeholder="https://example.com/cursor2.png"
                    value={formData.cursor2}
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
