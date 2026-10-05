import prisma from "../lib/prisma";
type CourseData = { name: string; description?: string | undefined; durationSemesters: number };
type CourseUpdate = { name?: string | undefined; description?: string | undefined; durationSemesters?: number | undefined };

export class CursoService {
  list(userId: string) {
    return prisma.course.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  }

  getById(userId: string, id: string) {
    return prisma.course.findFirst({ where: { id, userId } });
  }

  create(userId: string, data: CourseData) {
    return prisma.course.create({
      data: {
        ...data,
        description: data.description || null,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(userId: string, id: string, data: CourseUpdate) {
    const existing = await prisma.course.findFirst({ where: { id, userId }, select: { id: true } });
    if (!existing) return null;
    return prisma.course.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.durationSemesters !== undefined ? { durationSemesters: data.durationSemesters } : {}),
      },
    });
  }

  async remove(userId: string, id: string) {
    const result = await prisma.course.deleteMany({ where: { id, userId } });
    return result.count > 0;
  }
}
