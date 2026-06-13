import type { User } from "@prisma/client";

export type AuthenticatedUser = Pick<User, "id" | "email" | "createdAt">;

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};

