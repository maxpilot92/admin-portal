import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper for error responses
const errorResponse = (message: string, status: number) =>
  NextResponse.json({ status: "error", message }, { status });

export async function POST(request: NextRequest) {
  try {
    const { title, content, authorId, published, tags, url } =
      await request.json();

    // console.log("Request body:", {
    //   title,
    //   content,
    //   authorId,
    //   published,
    //   tags,
    //   categoryId,
    // });

    if (!title || !content) {
      return errorResponse("Title, content are required", 400);
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        url,
        content,
        published: published || false,
        tags: tags || [],
        ...(authorId && { User: { connect: { id: authorId } } }),
      },
      include: { User: true }, // Include relations
    });

    return NextResponse.json(
      { status: "success", data: blog },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const blogId = request.nextUrl.searchParams.get("blogId");

    if (blogId) {
      const blog = await prisma.blog.findUnique({
        where: { id: blogId },
        include: { User: true },
      });
      return blog
        ? NextResponse.json({ status: "success", data: blog })
        : errorResponse("Blog not found", 404);
    }

    const blogs = await prisma.blog.findMany({
      include: { User: true },
    });

    return NextResponse.json({ status: "success", data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { title, content, published, tags, categoryId, url } =
      await request.json();
    const id = request.nextUrl.searchParams.get("blogId");
    console.log("Request body:", {
      id,
      title,
      content,
      published,
      tags,
      categoryId,
      url,
    });
    if (!id) return errorResponse("Blog ID is required", 400);

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(typeof published === "boolean" && { published }),
        ...(tags !== undefined && { tags }),
        ...(url !== undefined && { url }),
        ...(categoryId !== undefined && {
          Category: { connect: { id: categoryId } },
        }),
      },
      include: { User: true },
    });

    return NextResponse.json({ status: "success", data: updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    return errorResponse("Internal server error", 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("blogId");
    if (!id) return errorResponse("Blog ID is required", 400);

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json(
      { status: "success", message: "Blog deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting blog:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
