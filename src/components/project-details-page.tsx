"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Github,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

interface Screenshot {
  id: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  screenshots: Screenshot[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  createdAt: string;
}

interface ProjectDetailsPageProps {
  id: string;
}

export function ProjectDetailsPage({ id }: ProjectDetailsPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/portfolio?portfolioId=${id}`);
        const raw = response.data;
        const data: Project = {
          id: raw.id,
          title: raw.title,
          description: raw.description,
          technologies: raw.technologies,
          images: raw.screenshots?.map((s: Screenshot) => s.url) || [],
          screenshots: raw.screenshots,
          liveUrl: raw.liveDemoUrl || "",
          repoUrl: raw.githubUrl || "",
          featured: raw.featured || false,
          createdAt: raw.createdAt,
        };
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const nextImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === project.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (project && project.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? project.images.length - 1 : prevIndex - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader heading="Project Details" text="View project information">
          <Button variant="outline" onClick={() => router.push("/portfolio")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </PageHeader>

        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-32 flex-shrink-0 rounded"
              />
            ))}
          </div>
          <Skeleton className="h-6 w-1/4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-20" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <PageHeader
          heading="Project Not Found"
          text="The requested project could not be found"
        >
          <Button variant="outline" onClick={() => router.push("/portfolio")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
        </PageHeader>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The project you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button onClick={() => router.push("/portfolio")}>
              Return to Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader heading="Project Details" text="View project information">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/portfolio")}>
            \ n <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio
          </Button>
          <Button onClick={() => router.push(`/portfolio/edit/${project.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Project
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          {project.featured && (
            <Badge variant="default" className="gap-1">
              <Star className="h-3.5 w-3.5" />
              Featured
            </Badge>
          )}
        </div>

        {/* Image Carousel */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={project.images?.[currentImageIndex] || "/placeholder.svg"}
            alt={`${project.title} - Screenshot ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-contain"
            priority
          />

          {project.images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next image</span>
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex
                        ? "bg-primary"
                        : "bg-primary/30"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {project.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {project.images.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                  index === currentImageIndex
                    ? "border-primary"
                    : "border-transparent hover:border-primary/50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${project.title} - Thumbnail ${index + 1}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Technologies */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            {project.description.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-4">
          {project.liveUrl && (
            <Button
              className="gap-2"
              onClick={() => window.open(project.liveUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              View Live Demo
            </Button>
          )}
          {project.repoUrl && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(project.repoUrl, "_blank")}
            >
              <Github className="h-4 w-4" />
              View Repository
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
