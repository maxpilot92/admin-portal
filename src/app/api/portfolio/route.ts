// /app/api/portfolio/route.ts

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/portfolio — fetch all portfolios
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("portfolioId");
    const categoryId = request.nextUrl.searchParams.get("categoryId");
    if (id) {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id },
        include: { screenshots: true },
      });
      if (!portfolio) {
        return NextResponse.json(
          { error: "Portfolio not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(portfolio);
    }
    const portfolios = await prisma.portfolio.findMany({
      where: {
        Category: {
          id: categoryId || undefined,
        },
      },
      include: { screenshots: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(portfolios);
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Unable to load portfolios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.formData();

    // 1. Basic fields
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const techRaw = data.get("technologies") as string; // e.g. "React,Next.js,Tailwind"
    const liveUrl = data.get("liveUrl") as string;
    const repoUrl = data.get("repoUrl") as string;
    const categoryId = data.get("categoryId") as string;

    // 2. Parse technologies into string[]
    const technologies = techRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // 3. Pull out uploaded files
    const screenshotUrls = data.getAll("images") as string[]; // Next.js gives you Blobs for file uploads
    if (!title || !description || technologies.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, technologies" },
        { status: 400 }
      );
    }

    // 4. Create portfolio with related screenshots
    const newPortfolio = await prisma.portfolio.create({
      data: {
        title,
        description,
        technologies,
        liveDemoUrl: liveUrl,
        githubUrl: repoUrl,
        screenshots: {
          create: screenshotUrls.map((url) => ({ url })),
        },
        Category: {
          connect: { id: categoryId },
        },
      },
      include: { screenshots: true, Category: true },
    });

    return NextResponse.json(newPortfolio, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("portfolioId");
    if (!id) {
      return NextResponse.json(
        { error: "Missing portfolio ID" },
        { status: 400 }
      );
    }

    const data = await request.formData();

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const techRaw = data.get("technologies") as string;
    const liveUrl = data.get("liveUrl") as string;
    const repoUrl = data.get("repoUrl") as string;
    const categoryId = data.get("categoryId") as string;
    console.log("categoryId", categoryId);
    const technologies = techRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const screenshotUrls = data.getAll("images") as string[];

    const updated = await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        description,
        technologies,
        liveDemoUrl: liveUrl,
        githubUrl: repoUrl,
        screenshots: screenshotUrls.length
          ? {
              deleteMany: {}, // remove old
              create: screenshotUrls.map((url) => ({ url })), // add new
            }
          : undefined,
        ...(categoryId && { Category: { connect: { id: categoryId } } }),
      },

      include: { screenshots: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/:id — delete portfolio and its screenshots
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("portfolioId");
    if (!id) {
      return NextResponse.json(
        { error: "Missing portfolio ID" },
        { status: 400 }
      );
    }
    const existing = await prisma.portfolio.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Remove related screenshots first (if no cascade rule)
    await prisma.screenshot.deleteMany({
      where: { portfolioId: id },
    });

    const deleted = await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Portfolio deleted successfully",
      portfolio: deleted,
    });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
