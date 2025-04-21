"use client";

import { ArrowDown, ArrowUp, FileText, FileImage, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useEffect, useState } from "react";
import axios from "axios";

export function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalMedia, setTotalMedia] = useState(0);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("/api/users");
        const num = response.data.users.length;
        setTotalUsers(num);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await axios.get("/api/blog");
        const num = response.data.data.length;
        setTotalBlogs(num);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    getBlogs();
  }, []);
  useEffect(() => {
    const getMedia = async () => {
      try {
        const response = await axios.get("/api/media");
        const num = response.data.data.length;
        setTotalMedia(num);
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    getMedia();
  }, []);
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Dashboard"
        text="Overview of your content management metrics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +18.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogs}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-4 w-4" />
                +12.5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <FileImage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedia}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-rose-500 flex items-center">
                <ArrowDown className="mr-1 h-4 w-4" />
                -4.5%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
            <CardDescription>Monthly content creation metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="blogs"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="media" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly user acquisition</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div> */}

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New blog post published</p>
                  <p className="text-xs text-muted-foreground">
                    10 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileImage className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New media uploaded</p>
                  <p className="text-xs text-muted-foreground">
                    20 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">
                    30 minutes ago
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Blog post updated</p>
                  <p className="text-xs text-muted-foreground">
                    40 minutes ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
            <CardDescription>
              Latest blog posts from your authors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Title</div>
                <div>Author</div>
                <div className="text-right">Status</div>
              </div>
              <div className="divide-y">
                {[
                  {
                    title: "Getting Started with React",
                    author: "John Doe",
                    status: "Published",
                  },
                  {
                    title: "Advanced Tailwind CSS Techniques",
                    author: "Jane Smith",
                    status: "Draft",
                  },
                  {
                    title: "Building Accessible Web Apps",
                    author: "Alex Johnson",
                    status: "Published",
                  },
                  {
                    title: "Next.js 14 Features",
                    author: "Sarah Williams",
                    status: "Published",
                  },
                  {
                    title: "State Management in 2023",
                    author: "Mike Brown",
                    status: "Draft",
                  },
                ].map((post, i) => (
                  <div key={i} className="grid grid-cols-3 py-3 text-sm">
                    <div className="font-medium truncate">{post.title}</div>
                    <div>{post.author}</div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.status === "Published"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400"
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
