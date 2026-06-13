import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user-repository.js";
import type { LoginInput, RegisterInput } from "../validators/auth-validator.js";
import { AppError } from "../utils/app-error.js";
import { signAccessToken } from "../utils/jwt.js";

function buildAuthResponse(id: string, email: string, createdAt: Date) {
  return {
    token: signAccessToken({ sub: id, email }),
    user: {
      id,
      email,
      createdAt
    }
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await userRepository.create(input.email, passwordHash);
    return buildAuthResponse(user.id, user.email, user.createdAt);
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid credentials", 401);
    }

    return buildAuthResponse(user.id, user.email, user.createdAt);
  }
};

