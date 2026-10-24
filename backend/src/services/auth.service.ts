import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { getDb } from "../database/db";
import { AppError } from "../middleware/errorHandler";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type UserRow = PublicUser & {
  passwordHash: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.createdAt,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function readName(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(400, "name is required");
  }

  return value.trim();
}

function readEmail(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(400, "email is required");
  }

  const email = normalizeEmail(value);
  if (!EMAIL_PATTERN.test(email)) {
    throw new AppError(400, "email is invalid");
  }

  return email;
}

function readPassword(value: unknown): string {
  if (typeof value !== "string" || !value) {
    throw new AppError(400, "password is required");
  }

  if (value.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(400, `password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  return value;
}

function signToken(userId: string): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresInSeconds,
  });
}

function findUserByEmail(email: string): UserRow | undefined {
  return getDb()
    .prepare(
      "SELECT id, name, email, passwordHash, createdAt FROM users WHERE email = ?"
    )
    .get(email) as UserRow | undefined;
}

export function registerUser(input: {
  name: unknown;
  email: unknown;
  password: unknown;
}): { token: string; user: PublicUser } {
  const name = readName(input.name);
  const email = readEmail(input.email);
  const password = readPassword(input.password);

  const user: UserRow = {
    id: randomUUID(),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString(),
  };

  const result = getDb()
    .prepare(
      `INSERT INTO users (id, name, email, passwordHash, createdAt)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(email) DO NOTHING`
    )
    .run(user.id, user.name, user.email, user.passwordHash, user.createdAt);

  if (result.changes === 0) {
    throw new AppError(409, "Email already registered");
  }

  return {
    token: signToken(user.id),
    user: toPublicUser(user),
  };
}

export function loginUser(input: {
  email: unknown;
  password: unknown;
}): { token: string; user: PublicUser } {
  const email = readEmail(input.email);
  const password = readPassword(input.password);
  const user = findUserByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    token: signToken(user.id),
    user: toPublicUser(user),
  };
}

export function verifyAccessToken(token: string): string {
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload === "string" || typeof payload.userId !== "string") {
      throw new AppError(401, "Invalid or expired token");
    }

    return payload.userId;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(401, "Invalid or expired token");
  }
}
