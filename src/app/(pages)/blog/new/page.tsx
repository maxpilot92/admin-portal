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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Image from "next/image";
import Editor from "@/components/tiptap/editor";
import useCategory from "@/hooks/useCategory";

export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: string;
  url: string;
  data: string;
  title: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [url, setUrl] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const categoriesData = useCategory({ categoryFor: "blog" });

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
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

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelectMedia = (media: (typeof mediaItems)[0]) => {
    setSelectedMedia(media);
    setUrl(media.url);
    setIsMediaDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/blog", {
        title,
        content, // This will now contain the latest content
        published: true, // Force publish state
        tags,
        categoryId,
        url,
        excerpt,
        seoTitle,
      });

      router.push("/blog");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/blog", {
        title,
        content, // This will now contain the latest content
        published: false, // Save as draft
        tags,
        categoryId,
        url,
        excerpt,
        seoTitle,
      });
      console.log("Draft saved successfully:", response);
      router.push("/blog");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateContent = (htmlContent: string) => {
    setContent(htmlContent);
  };

  useEffect(() => {
    (async () => {
      const data = await categoriesData;
      setCategories(data);
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          heading="Create New Blog Post"
          text="Create and publish a new blog post"
        >
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as Draft"
              )}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Publish
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
                    placeholder="Enter blog post title"
                    className="text-lg"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="content" className="text-base">
                    Content
                  </Label>
                  <Tabs defaultValue="write" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write" className="mt-2">
                      <Editor setContent={updateContent} />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-2">
                      <div className="border rounded-md p-4 min-h-[400px] prose dark:prose-invert max-w-none">
                        {content ? (
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <p className="text-muted-foreground">
                            Content preview will appear here...
                          </p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid gap-3">
                    <Label htmlFor="category" className="text-base">
                      Category
                    </Label>
                    <div className="flex gap-2">
                      <Select value={categoryId} onValueChange={setCategoryId}>
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

                  <div className="grid gap-3">
                    <Label htmlFor="tags" className="text-base">
                      Tags
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter to add)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <p className="text-sm text-muted-foreground">
                      Press Enter to add a tag. Tags help categorize your
                      content.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
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
                            Choose an image from your media library to use as
                            the featured image.
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
                                <p className="text-sm truncate">
                                  {media.title}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="excerpt" className="text-base">
                      Excerpt
                    </Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Write a short excerpt for your blog post..."
                      className="min-h-[100px]"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      A short summary of your post. This will be displayed on
                      blog listing pages.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="seo-title" className="text-base">
                      SEO Title
                    </Label>
                    <Input
                      id="seo-title"
                      placeholder="SEO optimized title"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      The title that will appear in search engine results.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
