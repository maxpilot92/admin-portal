import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: All services or a single service by ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("serviceId");
    const categoryId = request.nextUrl.searchParams.get("categoryId");
    if (id) {
      const service = await prisma.service.findUnique({ where: { id } });
      if (!service) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(service, { status: 200 });
    }

    const allServices = await prisma.service.findMany({
      where: {
        Category: {
          id: categoryId || undefined,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        Category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(allServices, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error fetching services" },
      { status: 500 }
    );
  }
}

// POST: Create new service
export async function POST(request: NextRequest) {
  try {
    const { title, description, image, categoryId, cursor1, cursor2 } =
      await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        image,
        cursor1,
        cursor2,
        Category: { connect: { id: categoryId } },
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Error creating service" },
      { status: 500 }
    );
  }
}

// PATCH: Update service by ID
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("serviceId");
    const { title, description, image, cursor1, cursor2, categoryId } =
      await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing service ID" },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        image,
        cursor1,
        cursor2,
        ...(categoryId && { Category: { connect: { id: categoryId } } }),
      },
    });

    return NextResponse.json(updatedService, { status: 200 });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Error updating service" },
      { status: 500 }
    );
  }
}

// DELETE: Delete service by ID
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("serviceId");
    if (!id) {
      return NextResponse.json(
        { error: "Missing service ID" },
        { status: 400 }
      );
    }

    const deleted = await prisma.service.delete({ where: { id } });

    return NextResponse.json(
      { message: "Service deleted successfully", service: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Error deleting service" },
      { status: 500 }
    );
  }
}
