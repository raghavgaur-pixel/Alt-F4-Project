import { prisma } from "../config/prisma.js";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(email: string, passwordHash: string) {
    return prisma.user.create({
      data: { email, passwordHash }
    });
  }
};

