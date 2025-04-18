import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: All testimonials or single by ID
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("testimonialId");
    if (id) {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });
      if (!testimonial) {
        return NextResponse.json(
          { error: "Testimonial not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(testimonial, { status: 200 });
    }

    const allTestimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(allTestimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Error fetching testimonials" },
      { status: 500 }
    );
  }
}

// POST: Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const { name, role, image, description } = await request.json();

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const newTestimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        image,
        description,
      },
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Error creating testimonial" },
      { status: 500 }
    );
  }
}

// PATCH: Update testimonial by ID
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("testimonialId");
    const { name, role, image, description } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing testimonial ID" },
        { status: 400 }
      );
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { name, role, image, description },
    });

    return NextResponse.json(updatedTestimonial, { status: 200 });
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Error updating testimonial" },
      { status: 500 }
    );
  }
}

// DELETE: Delete testimonial by ID
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("testimonialId");
    if (!id) {
      return NextResponse.json(
        { error: "Missing testimonial ID" },
        { status: 400 }
      );
    }

    const deleted = await prisma.testimonial.delete({ where: { id } });

    return NextResponse.json(
      { message: "Testimonial deleted successfully", testimonial: deleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Error deleting testimonial" },
      { status: 500 }
    );
  }
}
