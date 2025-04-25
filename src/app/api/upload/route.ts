import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const file = body.file;
  console.log("File received:", file);
  console.log("Cloudinary ENV Check:", {
    name: process.env.CLOUDINARY_CLOUD_NAME,
    key: !!process.env.CLOUDINARY_API_KEY,
    secret: !!process.env.CLOUDINARY_API_SECRET,
  });

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  console.log("→ Upload handler hit");

  try {
    console.log("→ Calling cloudinary.uploader.upload…");
    const result = await cloudinary.uploader.upload(file, {
      folder: "adminportal",
    });
    console.log("← Cloudinary upload succeeded:", result);
    return NextResponse.json(
      { url: result.secure_url, public_id: result.public_id },
      { status: 200 }
    );
  } catch (error) {
    console.error("‼ Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error },
      { status: 500 }
    );
  }
}
