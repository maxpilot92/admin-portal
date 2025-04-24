import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const publicId = body.public_id;

  if (!publicId) {
    return NextResponse.json(
      { error: "No public_id provided" },
      { status: 400 }
    );
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed", details: error },
      { status: 500 }
    );
  }
}
