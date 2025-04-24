import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const file = body.file;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "adminportal",
    });

    return NextResponse.json(
      { url: result.secure_url, public_id: result.public_id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed", details: error },
      { status: 500 }
    );
  }
}
