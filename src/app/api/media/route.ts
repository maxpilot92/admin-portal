// /api/media/route.js
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("mediaId");
    if (id) {
      const media = await prisma.media.findUnique({ where: { id } });
      if (!media) {
        return NextResponse.json({ error: "Media not found" }, { status: 404 });
      }
      // Here we assume the image is JPEG. Adjust the 'Content-Type' if using another format.
      return new NextResponse(media.data, {
        headers: { "Content-Type": "image/jpeg" },
      });
    }
    const mediaList = await prisma.media.findMany();
    return NextResponse.json({ data: mediaList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Error fetching media" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { base64Data, title } = await request.json();
    if (!base64Data) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }

    // Convert the base64 string to a Buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Create a new Media record without the URL first
    const newMedia = await prisma.media.create({
      data: {
        data: buffer,
        title,
      },
    });
    // push
    // Update the record to include the URL for retrieval
    const updatedMedia = await prisma.media.update({
      where: { id: newMedia.id },
      data: { url: `/api/media?mediaId=${newMedia.id}` },
    });

    return NextResponse.json(updatedMedia, { status: 201 });
  } catch (error) {
    console.error("Error uploading media:", error);
    return NextResponse.json(
      { error: "Error uploading media" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("mediaId");
  if (!id) {
    return NextResponse.json({ error: "Missing media ID" }, { status: 400 });
  }
  try {
    const deletedMedia = await prisma.media.delete({ where: { id } });
    return NextResponse.json({
      message: "Media deleted successfully",
      media: deletedMedia,
    });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Error deleting media" },
      { status: 500 }
    );
  }
}
