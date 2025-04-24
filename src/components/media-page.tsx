"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import Image from "next/image";
import { Media } from "@prisma/client";

export function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function fetchMedia() {
    try {
      setIsLoading(true);
      const response = await axios.get<{ data: Media[] }>("/api/media");
      setMediaItems(response.data.data);
    } catch (error) {
      console.log("Error fetching media:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMedia();
  }, []);

  // Use useMemo to avoid re-filtering on every render
  const filteredMedia = useMemo<Media[]>(() => {
    return mediaItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mediaItems, searchTerm]);

  const getBase64 = (file: File): Promise<string | null> => {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String =
          typeof reader.result === "string"
            ? reader.result // keep the full data URI including mime type
            : null;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  interface CloudinaryResponse {
    url: string;
    public_id: string;
  }

  const handleUpload = async () => {
    if (!selectedFile || !title.trim()) {
      return;
    }

    try {
      setIsUploading(true);
      const base64Data = await getBase64(selectedFile);

      // Upload file to Cloudinary
      const fileUpload = await axios.post<CloudinaryResponse>("/api/upload", {
        file: base64Data,
      });

      console.log("File upload response:", fileUpload.data);
      if (!fileUpload.data) {
        throw new Error("File upload failed");
      }
      const { url, public_id } = fileUpload.data;

      // Create media entry with the uploaded file's URL and public_id
      const media = await axios.post<{ data: Media }>("/api/media", {
        title: title.trim(),
        url,
        public_id,
      });

      if (!media.data) {
        // If media creation failed, delete the uploaded file from Cloudinary
        await axios.delete("/api/delete", {
          data: { public_id }, // Make sure to send public_id in the body
        });
      }

      // Close the dialog and reset form values
      setIsUploadDialogOpen(false);
      setTitle("");
      setSelectedFile(null);

      fetchMedia(); // Refresh the media list after upload
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setTitle("");
    setSelectedFile(null);
    setIsUploadDialogOpen(false);
  };

  const openDeleteDialog = (media: Media) => {
    setMediaToDelete(media);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteMedia = async () => {
    if (!mediaToDelete) return;

    try {
      await axios.delete("/api/delete", {
        data: { public_id: mediaToDelete.public_id },
      });
      await axios.delete(`/api/media?mediaId=${mediaToDelete.id}`);

      setMediaItems(mediaItems.filter((item) => item.id !== mediaToDelete.id));
      setIsDeleteDialogOpen(false);
      setMediaToDelete(null);
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Media Library"
        text="Manage images used in your blog posts"
      >
        <div className="flex gap-2">
          <Dialog
            open={isUploadDialogOpen}
            onOpenChange={(open) => {
              if (!open) resetUploadForm();
              setIsUploadDialogOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Upload New Media</DialogTitle>
                <DialogDescription>
                  Upload a new image to your media library.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter media title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="file">File</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">or</p>
                    <Input
                      type="file"
                      onChange={onFileChange}
                      accept="image/*"
                    />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetUploadForm}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || !title.trim() || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search media..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="unused">Unused</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-accent" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-grid-2x2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 12h18" />
              <path d="M12 3v18" />
            </svg>
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-accent" : ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-list"
            >
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <p className="text-muted-foreground">No media items found</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-video w-full h-48">
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white"
                    onClick={() => openDeleteDialog(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm font-medium truncate"
                    title={item.title}
                  >
                    {item.title}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setSelectedMedia(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-md">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm border-b">
            <div className="col-span-1">Preview</div>
            <div className="col-span-3">Title</div>
            <div className="col-span-7">URL</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-muted/50"
            >
              <div className="col-span-1">
                <div className="aspect-square w-10 h-10 rounded overflow-hidden relative">
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div
                className="col-span-3 font-medium truncate"
                title={item.title}
              >
                {item.title}
              </div>
              <div className="col-span-7 text-sm text-muted-foreground truncate">
                {item.url}
              </div>
              <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedMedia(item)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>View</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => openDeleteDialog(item)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media View Dialog */}
      {selectedMedia && (
        <Dialog
          open={!!selectedMedia}
          onOpenChange={(open) => !open && setSelectedMedia(null)}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedMedia.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="aspect-video overflow-hidden rounded-md relative h-[300px]">
                <Image
                  src={selectedMedia.url || "/placeholder.svg"}
                  alt={selectedMedia.title}
                  fill
                  sizes="(max-width: 700px) 100vw, 700px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-sm font-medium">URL</p>
                <p className="text-sm text-muted-foreground break-all">
                  {selectedMedia.url}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedMedia(null)}>
                Close
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this media item? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMediaToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMedia}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
