"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Check, ImageIcon, Loader2, Plus } from "lucide-react";
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
  DialogFooter,
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

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
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
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState<ICategory[]>();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [url, setUrl] = useState("");
  const categoriesData = useCategory({ categoryFor: "blog" });

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/blog?blogId=${blogId}`);
        const blogData = response.data.data;

        // Populate form fields with blog data
        setTitle(blogData.title);
        setContent(blogData.content);
        setCategoryId(blogData.categoryId);
        setTags(blogData.tags || []);
        setPublished(blogData.published);
        setUrl(blogData.url || "");

        // Set media if available
        if (blogData.mediaId && blogData.mediaUrl) {
          setSelectedMedia({
            id: blogData.mediaId,
            title: blogData.title, // You might want to store the media title in your database
            url: blogData.mediaUrl,
          });
        }

        // Set additional fields if available
        if (blogData.excerpt) setExcerpt(blogData.excerpt);
        if (blogData.seoTitle) setSeoTitle(blogData.seoTitle);
      } catch (error) {
        console.error("Error fetching blog post:", error);
        // Show error notification or redirect back
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [blogId]);

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

  useEffect(() => {
    (async () => {
      const data = await categoriesData;
      setCategories(data);
    })();
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSelectMedia = (media: (typeof mediaItems)[0]) => {
    setSelectedMedia(media);
    setUrl(process.env.NEXT_PUBLIC_DOMAIN + media.url);
    setIsMediaDialogOpen(false);
  };

  const updateContent = (htmlContent: string) => {
    setContent(htmlContent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Make PATCH request to update the blog post
      const response = await axios.patch(`/api/blog?blogId=${blogId}`, {
        title,
        content,
        published: true, // Force publish state
        tags,
        categoryId,
        url,
        excerpt,
        seoTitle,
      });

      console.log("Blog updated successfully:", response);
      router.push("/blog");
    } catch (error) {
      console.error("Error updating blog post:", error);
      // Show error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.patch(`/api/blog?blogId=${blogId}`, {
        title,
        content,
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

  const handleCategorySave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/category", {
        name: categoryName,
        categoryFor: "blog",
      });
      if (response.data.status === "success") {
        const data = await categoriesData;
        setCategories(data);
        setIsCategoryDialogOpen(false); // Close dialog
        setCategoryName(""); // Reset input field
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading blog post...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          heading="Edit Blog Post"
          text="Update and republish your blog post"
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
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Post
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
                      <Editor
                        setContent={updateContent}
                        initialContent={content}
                      />
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

                      <Dialog
                        open={isCategoryDialogOpen}
                        onOpenChange={setIsCategoryDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add new category</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>
                              Create a new category for your blog post.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleCategorySave}>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="new-category-name">Name</Label>
                                <Input
                                  id="new-category-name"
                                  value={categoryName}
                                  onChange={(e) =>
                                    setCategoryName(e.target.value)
                                  }
                                  placeholder="Enter category name"
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Add Category</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
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
