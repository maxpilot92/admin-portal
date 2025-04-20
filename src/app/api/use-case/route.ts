// /api/usecase/route.ts
import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const usecaseId = request.nextUrl.searchParams.get("usecaseId");

    const useCases = usecaseId
      ? await prisma.useCase.findMany({ where: { id: usecaseId } })
      : await prisma.useCase.findMany();

    return NextResponse.json({ data: useCases }, { status: 200 });
  } catch (error) {
    console.error("Error fetching use cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch use cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, image } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return NextResponse.json(
        { error: "JWT secret not configured" },
        { status: 500 }
      );
    }
    // Verify the token
    const decoded = verify(token, JWT_SECRET) as { userId: string };

    const newUseCase = await prisma.useCase.create({
      data: {
        title,
        description,
        image,
        user: {
          connect: {
            id: decoded.userId,
          },
        },
      },
      include: {
        user: true, // Optional: if you want to include user data in the response
      },
    });

    return NextResponse.json({ data: newUseCase }, { status: 201 });
  } catch (error) {
    console.error("Error creating use case:", error);
    return NextResponse.json(
      { error: "Failed to create use case" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { title, description, image } = await request.json();
    const id = request.nextUrl.searchParams.get("usecaseId");

    if (!id) {
      return NextResponse.json(
        { error: "Missing use case ID" },
        { status: 400 }
      );
    }

    const updatedUseCase = await prisma.useCase.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json(
      { message: "Use case updated", data: updatedUseCase },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating use case:", error);
    return NextResponse.json(
      { error: "Failed to update use case" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing use case ID" },
        { status: 400 }
      );
    }

    const deletedUseCase = await prisma.useCase.delete({ where: { id } });

    return NextResponse.json(
      { message: "Use case deleted", data: deletedUseCase },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting use case:", error);
    return NextResponse.json(
      { error: "Failed to delete use case" },
      { status: 500 }
    );
  }
}
