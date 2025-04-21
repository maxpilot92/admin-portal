import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get all settings or a specific one by ID
export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// Create a new setting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteName, siteUrl, siteLogo, siteFavicon, mode } = body;

    const newSetting = await prisma.setting.create({
      data: { siteName, siteUrl, siteLogo, siteFavicon, mode },
    });

    return NextResponse.json(newSetting, { status: 201 });
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json(
      { error: "Failed to create setting" },
      { status: 500 }
    );
  }
}

// Update an existing setting using PATCH
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing setting ID" },
        { status: 400 }
      );
    }

    console.log("Update data:", updateData);

    const updatedSetting = await prisma.setting.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSetting, { status: 200 });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

// Delete a setting
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing setting ID" }, { status: 400 });
  }

  try {
    const deletedSetting = await prisma.setting.delete({ where: { id } });
    return NextResponse.json(
      { message: "Setting deleted", setting: deletedSetting },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json(
      { error: "Failed to delete setting" },
      { status: 500 }
    );
  }
}
