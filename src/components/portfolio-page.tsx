"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard, Screenshots } from "./project-card";
import axios from "axios";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  images: string[];
  screenshots: Screenshots[];
  liveUrl: string;
  repoUrl: string;
  featured: boolean;
  createdAt: string;
}

export function PortfolioPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "alphabetical">(
    "newest"
  );
  const [filterTech, setFilterTech] = useState<string | null>(null);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/projects')
        // const data = await response.json()
        const response = await axios.get("/api/portfolio");
        const data = response.data;
        console.log(data);

        // const mockProjects: Project[] = [
        //   {
        //     id: "1",
        //     title: "E-Commerce Platform",
        //     description:
        //       "A full-featured e-commerce platform with product management, cart functionality, and payment processing.",
        //     technologies: ["React", "Node.js", "MongoDB", "Stripe"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/ecommerce",
        //     featured: true,
        //     createdAt: "2023-05-15T10:30:00Z",
        //   },
        //   {
        //     id: "2",
        //     title: "Task Management App",
        //     description:
        //       "A collaborative task management application with real-time updates and team workspaces.",
        //     technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/taskmanager",
        //     featured: false,
        //     createdAt: "2023-06-20T14:15:00Z",
        //   },
        //   {
        //     id: "3",
        //     title: "Weather Dashboard",
        //     description:
        //       "A weather dashboard that displays current conditions and forecasts for multiple locations.",
        //     technologies: ["React", "OpenWeather API", "Chart.js"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/weather",
        //     featured: false,
        //     createdAt: "2023-07-10T09:45:00Z",
        //   },
        //   {
        //     id: "4",
        //     title: "Portfolio Website",
        //     description:
        //       "A personal portfolio website showcasing projects and skills with a modern design.",
        //     technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/portfolio",
        //     featured: true,
        //     createdAt: "2023-08-05T16:20:00Z",
        //   },
        //   {
        //     id: "5",
        //     title: "Blog Platform",
        //     description:
        //       "A content management system for creating and managing blog posts with user authentication.",
        //     technologies: ["Next.js", "Prisma", "PostgreSQL", "NextAuth.js"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/blog",
        //     featured: false,
        //     createdAt: "2023-09-12T11:10:00Z",
        //   },
        //   {
        //     id: "6",
        //     title: "Fitness Tracker",
        //     description:
        //       "A mobile-responsive fitness tracking application with workout plans and progress visualization.",
        //     technologies: ["React Native", "Firebase", "D3.js"],
        //     images: ["/placeholder.svg?height=400&width=600"],
        //     liveUrl: "https://example.com",
        //     repoUrl: "https://github.com/example/fitness",
        //     featured: true,
        //     createdAt: "2023-10-18T13:25:00Z",
        //   },
        // ];

        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get all unique technologies from projects
  const allTechnologies = Array.from(
    new Set(projects.flatMap((project) => project.technologies))
  ).sort();

  // Filter and sort projects
  const filteredProjects = projects
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .filter((project) =>
      filterTech ? project.technologies.includes(filterTech) : true
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Portfolio Projects"
        text="Manage your portfolio projects and showcases"
      >
        <Button onClick={() => router.push("/portfolio/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                {filterTech || "All Technologies"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterTech(null)}>
                All Technologies
              </DropdownMenuItem>
              {allTechnologies.map((tech) => (
                <DropdownMenuItem
                  key={tech}
                  onClick={() => setFilterTech(tech)}
                >
                  {tech}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border bg-card overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
