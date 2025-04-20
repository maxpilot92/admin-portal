"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  ImageIcon,
  Loader2,
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
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface UseCase {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface UseCaseFormData {
  title: string;
  description: string;
  image?: string;
}

export default function UseCasesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [useCaseToDelete, setUseCaseToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/use-case");
        if (!response.ok) throw new Error("Failed to fetch use cases");
        const data = await response.json();
        setUseCases(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching use cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUseCases();
  }, []);

  const filteredUseCases = useCases.filter((useCase) =>
    useCase.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const handleEditUseCase = (useCaseId: string) => {
    router.push(`/use-case/edit/${useCaseId}`);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (useCaseId: string) => {
    setUseCaseToDelete(useCaseId);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual deletion after confirmation
  const handleDeleteUseCase = async () => {
    if (!useCaseToDelete) return;

    try {
      const response = await fetch(`/api/use-case?id=${useCaseToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete use case");

      // Refresh the use cases list
      setUseCases(useCases.filter((useCase) => useCase.id !== useCaseToDelete));

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setUseCaseToDelete(null);
    } catch (error) {
      console.error("Error deleting use case:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader heading="Use Cases" text="Manage your portfolio use cases">
          <Button onClick={() => router.push("/use-case/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Use Case
          </Button>
        </PageHeader>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search use cases..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : useCases.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No use cases found</h3>
              <p className="mb-4 mt-2 text-center text-muted-foreground">
                Get started by creating your first use case.
              </p>
              <Button onClick={() => router.push("/use-case/new")}>
                Add your first use case
              </Button>
            </CardContent>
          </Card>
        ) : filteredUseCases.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64 p-6">
              <p className="text-muted-foreground">
                No use cases match your search.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[120px]">
                    Created
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[120px]">
                    Updated
                  </TableHead>
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUseCases.map((useCase) => (
                  <TableRow key={useCase.id}>
                    <TableCell>
                      {useCase.image ? (
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <Image
                            height={40}
                            width={40}
                            src={useCase.image || "/placeholder.svg"}
                            alt={useCase.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {useCase.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {useCase.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(useCase.createdAt)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                      {formatDate(useCase.updatedAt)}
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
                            onClick={() => handleEditUseCase(useCase.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => openDeleteDialog(useCase.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
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
              <AlertDialogTitle>Delete Use Case</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this use case? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setUseCaseToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUseCase}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
