import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Get one or all teams
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("teamId");

    if (id) {
      const team = await prisma.team.findUnique({ where: { id } });
      if (!team) {
        return NextResponse.json({ error: "Team not found" }, { status: 404 });
      }
      return NextResponse.json(team, { status: 200 });
    }

    const teamList = await prisma.team.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: teamList }, { status: 200 });
  } catch (error) {
    console.error("Error fetching team(s):", error);
    return NextResponse.json(
      { error: "Error fetching team(s)" },
      { status: 500 }
    );
  }
}

// POST: Create a new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, image, description } = body;

    if (!name || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newTeam = await prisma.team.create({
      data: { name, role, image, description },
    });

    return NextResponse.json(newTeam, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json({ error: "Error creating team" }, { status: 500 });
  }
}

// PATCH: Update team by ID
export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("teamId");
  if (!id) {
    return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const updatedTeam = await prisma.team.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedTeam, { status: 200 });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json({ error: "Error updating team" }, { status: 500 });
  }
}

// DELETE: Delete team by ID
export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("teamId");
  if (!id) {
    return NextResponse.json({ error: "Missing team ID" }, { status: 400 });
  }

  try {
    const deletedTeam = await prisma.team.delete({ where: { id } });
    return NextResponse.json({
      message: "Team deleted successfully",
      team: deletedTeam,
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ error: "Error deleting team" }, { status: 500 });
  }
}
