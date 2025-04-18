import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
    const { email, role, username } = data;
    if (!email || !role || !username) {
      return NextResponse.json(
        JSON.stringify({ message: "Email, username and role are required" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data,
    });
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
