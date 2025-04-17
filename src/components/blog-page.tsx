"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import axios from "axios";

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blogs: Blog[];
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  tags: string[];
  categoryId: string;
  Category: Category;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  mediaId: string;
  url: string;
}

export function BlogPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([
    { id: "1", name: "Development" },
    { id: "2", name: "UX/UI" },
    { id: "3", name: "Performance" },
    { id: "4", name: "DevOps" },
  ]);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/blog");
        const data = response.data.data;
        console.log("Blog posts data:", data);
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getBlogPosts();
  }, []);

  const filteredPosts = blogPosts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredPosts, "filteredPosts");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleEditBlog = (blogId: string) => {
    router.push(`/blog/edit/${blogId}`);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (blogId: string) => {
    setBlogToDelete(blogId);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual deletion after confirmation
  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await axios.delete(`/api/blog?blogId=${blogToDelete}`);
      // Refresh the blog posts list
      setBlogPosts(blogPosts.filter((post) => post.id !== blogToDelete));
      // Close the dialog
      setIsDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error("Error deleting blog post:", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader heading="Blog Posts" text="Manage your blog content">
        <Button onClick={() => router.push("/blog/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Blog
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search blog posts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex justify-between min-w-[150px]"
                >
                  <span>Categories</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuItem onSelect={() => setCategoryFilter("")}>
                  All Categories
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onSelect={() => setCategoryFilter(category.id)}
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add New Category</span>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your blog posts.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Here you would normally save the category to your database
                  // For now, we'll just add it to the local state
                  const newId = Math.random().toString(36).substring(2, 9);
                  const newCategory = { id: newId, name: newCategoryName };
                  setCategories([...categories, newCategory]);
                  console.log(categoryFilter);
                  setCategoryFilter(newId);
                  setNewCategoryName("");
                  e.currentTarget.closest("dialog")?.close();
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-category-name">Name</Label>
                    <Input
                      id="new-category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
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
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            defaultValue=""
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead className="w-[50px]">Title</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Category</TableHead>
                <TableHead className="w-[250px]">Tags</TableHead>
                <TableHead className="w-[120px]">Created</TableHead>
                <TableHead className="w-[120px]">Updated</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No blog posts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.url && (
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <Image
                            width={40}
                            height={40}
                            src={post.url || "/placeholder.svg"}
                            alt={post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant={post.published ? "default" : "outline"}
                        className={post.published ? "bg-emerald-500" : ""}
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.Category?.name ?? " "}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(post.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/blog/view/${post.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditBlog(post.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(post.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blog post? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBlogToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
