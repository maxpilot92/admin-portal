import prisma from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const singleUser = request.nextUrl.searchParams.get("singleUser");
    if (singleUser) {
      const token = request.cookies.get("token")?.value;
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.json(
          { message: "JWT secret not configured" },
          { status: 500 }
        );
      }
      const decoded = verify(token, JWT_SECRET) as { userId: string };
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
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
