import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    // Hanya admin/instruktur yang boleh lihat list user
    if (!session || (session.user.role !== "instruktur" && session.user.role !== "admin" && session.user.role !== "super_admin")) {
        return NextResponse.json([], { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const whereClause: any = {
      role: 'user',
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.users.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      },
      orderBy: { name: "asc" },
      take: limit > 0 ? limit : 100
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed fetch users" }, { status: 500 });
  }
}