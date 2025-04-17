"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ExternalLink,
  Github,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useState } from "react";
import axios from "axios";

export interface Screenshots {
  id: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  screenshots: Screenshots[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/portfolio?portfolioId=${project.id}`);
      console.log(`Deleting project ${project.id}`);
      // After successful deletion, you might want to refresh the projects list
      // or navigate back to the portfolio page
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden group h-full flex flex-col">
        <div
          className="relative h-48 cursor-pointer"
          onClick={() => router.push(`/portfolio/${project.id}`)}
        >
          <Image
            src={
              project.screenshots?.[0]?.url ||
              "/placeholder.svg?height=400&width=600"
            }
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {project.featured && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Star className="h-4 w-4" />
            </div>
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle
              className="text-lg cursor-pointer hover:text-primary transition-colors"
              onClick={() => router.push(`/portfolio/${project.id}`)}
            >
              {project.title}
            </CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push(`/portfolio/${project.id}`)}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push(`/portfolio/edit/${project.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <div className="flex flex-wrap gap-1 mt-2">
            {project.technologies.slice(0, 4).map((tech, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 4} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => window.open(project.liveUrl, "_blank")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Live Demo
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => window.open(project.repoUrl, "_blank")}
          >
            <Github className="h-3.5 w-3.5" />
            Repository
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project &quot;{project.title}
              &quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
