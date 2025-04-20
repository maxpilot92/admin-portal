"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Eye,
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
import Image from "next/image";

export interface Service {
  id: string;
  title: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ServicesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/service");
        if (!response.ok) throw new Error("Failed to fetch services");
        const data = await response.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  function isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  const handleEditService = (serviceId: string) => {
    router.push(`/services/edit/${serviceId}`);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual deletion after confirmation
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(
        `/api/service?serviceId=${serviceToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete service");

      // Refresh the services list
      setServices(services.filter((service) => service.id !== serviceToDelete));

      // Close the dialog
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader heading="Services" text="Manage your service offerings">
          <Button onClick={() => router.push("/services/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </PageHeader>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search services..."
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
                {filteredServices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No services found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        {service.image ? (
                          <div className="h-10 w-10 rounded overflow-hidden">
                            <Image
                              width={40}
                              height={40}
                              src={
                                isValidUrl(service.image)
                                  ? service.image
                                  : "/placeholder.svg"
                              }
                              alt={service.title}
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
                        {service.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {service.description || "—"}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {formatDate(service.createdAt)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {formatDate(service.updatedAt || service.createdAt)}
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
                              onClick={() =>
                                router.push(`/services/view/${service.id}`)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditService(service.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(service.id)}
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
              <AlertDialogTitle>Delete Service</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this service? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setServiceToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteService}
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
