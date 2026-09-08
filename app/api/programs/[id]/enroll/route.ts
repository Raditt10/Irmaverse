import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { grantXp } from "@/lib/gamification";

// POST: Enroll current user in program
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const program = await prisma.programs.findUnique({ where: { id } });
    if (!program) {
      return NextResponse.json(
        { error: "Program tidak ditemukan" },
        { status: 404 },
      );
    }

    // Sequential enrollment validation
    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    const isPrivileged = user?.role === "instruktur" || user?.role === "admin" || user?.role === "super_admin";

    if (program.stageOrder && program.stageOrder > 1 && !isPrivileged) {
      // Find prerequisite program (same grade + category, previous stageOrder)
      const prereq = await prisma.programs.findFirst({
        where: {
          grade: program.grade,
          category: program.category,
          stageOrder: program.stageOrder - 1,
        },
        select: { id: true, title: true, totalKajian: true, material: { select: { id: true } } },
      });

      if (prereq) {
        const prereqMaterialIds = prereq.material.map((m) => m.id);
        const prereqAttendanceCount = prereqMaterialIds.length > 0
          ? await prisma.attendance.count({
              where: { userId: session.user.id, materialId: { in: prereqMaterialIds }, status: "hadir" },
            })
          : 0;
        const prereqTotal = prereq.totalKajian > 0 ? prereq.totalKajian : prereqMaterialIds.length;
        const prereqCompleted = prereqTotal > 0 && prereqAttendanceCount >= prereqTotal;

        if (!prereqCompleted) {
          return NextResponse.json(
            { error: `Kamu harus menyelesaikan "${prereq.title}" terlebih dahulu sebelum mendaftar program ini.` },
            { status: 403 },
          );
        }
      }
    }

    let targetUserId = session.user.id;
    let body: any = null;
    try {
      body = await req.json();
    } catch (e) {
      // Body may be empty if simple POST
    }

    if (body?.userId) {
      if (!isPrivileged) {
        return NextResponse.json(
          { error: "Hanya instruktur atau admin yang dapat mendaftarkan pengguna lain" },
          { status: 403 },
        );
      }
      targetUserId = body.userId;
    }

    // Check target user existence
    const targetUser = await prisma.users.findUnique({
      where: { id: targetUserId },
      select: { id: true, name: true },
    });
    if (!targetUser) {
      return NextResponse.json(
        { error: "Pengguna tidak ditemukan" },
        { status: 404 },
      );
    }

    // Check if already enrolled
    const existing = await prisma.program_enrollments.findUnique({
      where: { programId_userId: { programId: id, userId: targetUserId } },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Pengguna sudah terdaftar di program ini" },
        { status: 200 },
      );
    }

    await prisma.program_enrollments.create({
      data: {
        id: crypto.randomUUID(),
        programId: id,
        userId: targetUserId,
      },
    });

    // Grant XP for program enrollment
    try {
      await grantXp({
        userId: targetUserId,
        type: "program_enrolled",
        title: `Mendaftar Program: ${program.title}`,
        description: `Berhasil mendaftar di program ${program.title}`,
        metadata: { programId: id, programName: program.title },
      });
    } catch (e) {
      console.error("Gagal grant XP program enroll:", e);
    }

    return NextResponse.json(
      { message: `Berhasil mendaftarkan ${targetUser.name || "anggota"} ke program` },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error enrolling in program:", error);
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}

// DELETE: Unenroll user from program (Self or Privileged)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get("userId");

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });
    const isPrivileged =
      user?.role === "instruktur" ||
      user?.role === "admin" ||
      user?.role === "super_admin";

    let targetUserId = session.user.id;
    if (queryUserId && queryUserId !== session.user.id) {
      if (!isPrivileged) {
        return NextResponse.json(
          { error: "Tidak memiliki izin untuk mengeluarkan anggota" },
          { status: 403 },
        );
      }
      targetUserId = queryUserId;
    }

    const existing = await prisma.program_enrollments.findUnique({
      where: { programId_userId: { programId: id, userId: targetUserId } },
      include: { users: { select: { name: true } } },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Anggota tidak terdaftar pada program ini" },
        { status: 404 },
      );
    }

    await prisma.program_enrollments.delete({
      where: { programId_userId: { programId: id, userId: targetUserId } },
    });

    return NextResponse.json(
      { message: `Berhasil mengeluarkan ${existing.users?.name || "anggota"} dari program` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting program enrollment:", error);
    return NextResponse.json(
      { error: "Gagal mengeluarkan anggota dari program" },
      { status: 500 },
    );
  }
}
