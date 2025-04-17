"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  FileImage,
  FileText,
  Briefcase,
  Wrench,
  Lightbulb,
  Users,
  Settings,
  UserRound,
  MessageSquareQuote,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Media",
      icon: FileImage,
      href: "/media",
      active: pathname === "/media",
    },
    {
      label: "Blog",
      icon: FileText,
      href: "/blog",
      active: pathname === "/blog",
    },
    {
      label: "Portfolio",
      icon: Briefcase,
      href: "/portfolio",
      active: pathname === "/portfolio",
    },
    {
      label: "Services",
      icon: Wrench,
      href: "/services",
      active: pathname === "/services",
    },
    {
      label: "Use Case",
      icon: Lightbulb,
      href: "/use-case",
      active: pathname === "/use-case",
    },
    {
      label: "Users",
      icon: Users,
      href: "/users",
      active: pathname === "/users",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
    {
      label: "Team Member",
      icon: UserRound,
      href: "/team",
      active: pathname === "/team",
    },
    {
      label: "Testimonials",
      icon: MessageSquareQuote,
      href: "/testimonials",
      active: pathname === "/testimonials",
    },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">
                A
              </span>
            </div>
            <span className="font-semibold">Admin Dashboard</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onOpenChange(false);
                  }
                }}
              >
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    route.active
                      ? "bg-accent text-accent-foreground"
                      : "transparent"
                  )}
                >
                  <route.icon className="mr-3 h-5 w-5" />
                  <span>{route.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted">
              <Image
                src="/placeholder.svg?height=36&width=36"
                alt="User avatar"
                width={100}
                height={100}
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
