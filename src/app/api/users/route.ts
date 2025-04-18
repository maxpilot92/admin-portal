import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("userId");
    if (id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      return NextResponse.json(
        { user, message: "User found" },
        { status: 200 }
      );
    }

    const users = await prisma.user.findMany();

    return NextResponse.json(
      { users, message: "Users found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  }
}
