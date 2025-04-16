import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const errorResponse = (message: string, status: number) =>
  NextResponse.json({ status: "error", message }, { status });

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) return errorResponse("Category name is required", 400);

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json({ status: "success", data: category });
  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse("Internal server error", 500);
  }
}

// GET /api/category
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { blog: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ status: "success", data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse("Internal server error", 500);
  }
}

// PATCH /api/category
export async function PATCH(request: NextRequest) {
  try {
    const { id, name } = await request.json();
    if (!id) return errorResponse("Category ID is required", 400);

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
      },
    });

    return NextResponse.json({ status: "success", data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse("Internal server error", 500);
  }
}

// DELETE /api/category
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("categoryId");
    if (!id) return errorResponse("Category ID is required", 400);

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      status: "success",
      message: "Category deleted",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse("Internal server error", 500);
  }
}
