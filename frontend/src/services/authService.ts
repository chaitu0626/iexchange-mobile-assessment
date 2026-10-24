import * as SecureStore from "expo-secure-store";
import { apiRequest } from "./api";
import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  SignupCredentials,
} from "../types/auth";

const SESSION_KEY = "iexchange.auth.session";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseUser(value: unknown): AuthUser | null {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string" ||
    typeof value.createdAt !== "string"
  ) {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    email: value.email,
    createdAt: value.createdAt,
  };
}

function parseSession(value: unknown): AuthSession | null {
  if (
    !isRecord(value) ||
    typeof value.token !== "string" ||
    value.token.length === 0
  ) {
    return null;
  }

  const user = parseUser(value.user);
  return user ? { token: value.token, user } : null;
}

function parseAuthResponse(value: unknown): AuthSession {
  if (!isRecord(value) || !isRecord(value.data)) {
    throw new Error("The server returned an unexpected authentication response.");
  }

  const session = parseSession(value.data);
  if (!session) {
    throw new Error("The server returned incomplete authentication details.");
  }

  return session;
}

async function saveSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function register(
  credentials: SignupCredentials
): Promise<AuthSession> {
  const response = await apiRequest("/auth/register", {
    method: "POST",
    body: {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
    },
  });
  const session = parseAuthResponse(response);
  await saveSession(session);
  return session;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthSession> {
  const response = await apiRequest("/auth/login", {
    method: "POST",
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });
  const session = parseAuthResponse(response);
  await saveSession(session);
  return session;
}

export async function logout(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function restoreSession(): Promise<AuthSession | null> {
  const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
  if (!storedSession) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedSession);
  } catch {
    await logout();
    return null;
  }

  const session = parseSession(parsed);
  if (!session) {
    await logout();
  }

  return session;
}
