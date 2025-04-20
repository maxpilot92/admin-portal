"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

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
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  // Ref for tracking focused submenu item
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Toggle function is now specifically for the dropdown arrow
  const toggleMenuItem = (
    label: string,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    // Stop the event from propagating
    e.preventDefault();
    e.stopPropagation();

    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Handle keyboard navigation for dropdown items
  const handleKeyDown = (label: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      toggleMenuItem(label, e);
    }
  };

  useEffect(() => {
    const currentUser = async () => {
      try {
        const response = await axios.get("/api/users?singleUser=true");
        setEmail(response.data.user.email);
        setUsername(response.data.user.username);
        setAvatarUrl(response.data.user.avatarUrl);
      } catch (error) {
        console.log(error);
      }
    };
    currentUser();
  }, []);

  // Auto-expand the active section on initial load and when pathname changes
  useEffect(() => {
    const newExpandedState = { ...expandedItems };

    routes.forEach((route) => {
      if (route.children && route.children.some((child) => child.active)) {
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
      href: "/blog", // Change this to actual link path, as we'll handle dropdown separately
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
      href: "/portfolio", // Change this to actual link path
      active: pathname.startsWith("/portfolio"),
      children: [
        {
          label: "All Portfolio",
          href: "/portfolio",
          active: pathname === "/portfolio",
        },
        {
          label: "Categories",
          href: "/portfolio/categories",
          active: pathname === "/portfolio/categories",
        },
      ],
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

  // Animation variants for the dropdown menu
  const dropdownVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2 },
      },
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeOut" },
        opacity: { duration: 0.3, delay: 0.1 },
      },
    },
  };

  // Animation variants for hover/focus indicators
  const indicatorVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: { width: 3, opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-300 ease-in-out lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        aria-label="Sidebar Navigation"
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
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="grid gap-1 px-2" aria-label="Main Navigation">
            {routes.map((route) => (
              <div key={route.label} className="mb-1">
                {route.children ? (
                  <div className="space-y-1">
                    {/* Parent menu item with separate clickable areas */}
                    <div
                      ref={(el) => {
                        menuRefs.current[route.label] = el;
                      }}
                      className={cn(
                        "group relative flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/70 hover:text-accent-foreground transition-colors duration-200",
                        route.active ||
                          route.children?.some((child) => child.active)
                          ? "bg-accent/80 text-accent-foreground font-medium"
                          : "text-foreground/80"
                      )}
                      role="button"
                      aria-expanded={expandedItems[route.label] || false}
                      aria-controls={`submenu-${route.label}`}
                    >
                      {/* Active indicator */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-primary rounded-r"
                        initial="hidden"
                        animate={
                          route.active ||
                          route.children?.some((child) => child.active)
                            ? "visible"
                            : "hidden"
                        }
                        variants={indicatorVariants}
                      />

                      {/* Label area - clickable link */}
                      <Link
                        href={route.href}
                        className="flex items-center flex-1"
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onOpenChange(false);
                          }
                        }}
                      >
                        <route.icon className="mr-3 h-5 w-5" />
                        <span>{route.label}</span>
                      </Link>

                      {/* Toggle arrow - separate clickable area */}
                      <div
                        className="cursor-pointer p-1 hover:bg-accent/90 rounded-md ml-2"
                        onClick={(e) => toggleMenuItem(route.label, e)}
                        onKeyDown={(e) => handleKeyDown(route.label, e)}
                        tabIndex={0}
                        role="button"
                        aria-label={
                          expandedItems[route.label]
                            ? `Collapse ${route.label} menu`
                            : `Expand ${route.label} menu`
                        }
                      >
                        <motion.div
                          animate={{
                            rotate: expandedItems[route.label] ? 180 : 0,
                          }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Submenu items */}
                    <AnimatePresence initial={false}>
                      {expandedItems[route.label] && (
                        <motion.div
                          id={`submenu-${route.label}`}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={dropdownVariants}
                          className="overflow-hidden"
                        >
                          <div className="pl-10 space-y-1 pt-1">
                            {route.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => {
                                  if (window.innerWidth < 1024) {
                                    onOpenChange(false);
                                  }
                                  // Notice: No toggle action here
                                }}
                              >
                                <div
                                  className={cn(
                                    "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/70 hover:text-accent-foreground transition-colors duration-200",
                                    child.active
                                      ? "bg-accent/60 text-accent-foreground"
                                      : "text-foreground/70"
                                  )}
                                  role="menuitem"
                                  tabIndex={0}
                                >
                                  {/* Active indicator for submenu */}
                                  <motion.div
                                    className="absolute left-0 top-0 bottom-0 bg-primary rounded-r"
                                    initial="hidden"
                                    animate={
                                      child.active ? "visible" : "hidden"
                                    }
                                    variants={indicatorVariants}
                                  />
                                  <span>{child.label}</span>
                                </div>
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
                    <div
                      className={cn(
                        "group relative flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent/70 hover:text-accent-foreground transition-colors duration-200",
                        route.active
                          ? "bg-accent/80 text-accent-foreground font-medium"
                          : "text-foreground/80"
                      )}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {/* Active indicator */}
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-primary rounded-r"
                        initial="hidden"
                        animate={route.active ? "visible" : "hidden"}
                        variants={indicatorVariants}
                      />
                      <route.icon className="mr-3 h-5 w-5" />
                      <span>{route.label}</span>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted overflow-hidden">
              <Image
                width={36}
                height={36}
                src={avatarUrl || "/placeholder.svg"}
                alt="User avatar"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
