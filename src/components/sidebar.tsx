"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  // State to track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Toggle function for expanding/collapsing menu items
  const toggleMenuItem = (label: string, e: React.MouseEvent) => {
    // Stop the event from propagating to prevent any parent handlers from firing
    e.preventDefault();
    e.stopPropagation();

    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Auto-expand the active section on initial load and when pathname changes
  useEffect(() => {
    const routes = [
      {
        label: "Blog",
        active: pathname.startsWith("/blog"),
      },
      // Add other routes with children here if needed
    ];

    const newExpandedState = { ...expandedItems };

    routes.forEach((route) => {
      if (route.active) {
        newExpandedState[route.label] = true;
      }
    });

    setExpandedItems(newExpandedState);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Blog",
      icon: FileText,
      href: "#", // Changed to # to prevent navigation when clicking the parent
      active: pathname.startsWith("/blog"),
      children: [
        {
          label: "All Posts",
          href: "/blog",
          active: pathname === "/blog",
        },
        {
          label: "Categories",
          href: "/blog/categories",
          active: pathname === "/blog/categories",
        },
        {
          label: "Tags",
          href: "/blog/tags",
          active: pathname === "/blog/tags",
        },
      ],
    },
    {
      label: "Media",
      icon: FileImage,
      href: "/media",
      active: pathname === "/media",
    },
    {
      label: "Portfolio",
      icon: Briefcase,
      href: "/portfolio",
      active: pathname.startsWith("/portfolio"),
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
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
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
              <div key={route.label} className="mb-1">
                {route.children ? (
                  <div className="space-y-1">
                    {/* Parent menu item with toggle functionality */}
                    <div
                      className={cn(
                        "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer",
                        route.active
                          ? "bg-accent text-accent-foreground"
                          : "transparent"
                      )}
                      onClick={(e) => toggleMenuItem(route.label, e)}
                    >
                      <div className="flex items-center">
                        <route.icon className="mr-3 h-5 w-5" />
                        <span>{route.label}</span>
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedItems[route.label] ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </div>

                    {/* Submenu items */}
                    <AnimatePresence initial={false}>
                      {expandedItems[route.label] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="pl-6 space-y-1 pt-1">
                            {route.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => {
                                  if (window.innerWidth < 1024) {
                                    onOpenChange(false);
                                  }
                                }}
                              >
                                <span
                                  className={cn(
                                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                    child.active
                                      ? "bg-accent text-accent-foreground"
                                      : "transparent"
                                  )}
                                >
                                  <span>{child.label}</span>
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted">
              <img
                src="/placeholder.svg?height=36&width=36"
                alt="User avatar"
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
