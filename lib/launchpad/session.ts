import "server-only";
import { headers } from "next/headers";
import { cache } from "react";
import { auth, type SessionUser } from "@/lib/auth";

export const getSession = cache(
  async () => await auth.api.getSession({ headers: await headers() })
);

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("forbidden");
    this.name = "ForbiddenError";
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();

  if (user.role !== "admin") {
    throw new ForbiddenError();
  }

  return user;
}

export const isAdmin = (user: SessionUser | null | undefined) =>
  user?.role === "admin";

export interface Viewer {
  alquimistaCheckedAt: Date | null;
  email: string;
  id: string;
  image: string | null;
  isAlquimista: boolean;
  locale: string;
  name: string;
  role: string;
}

export function toViewer(user: SessionUser | null): Viewer | null {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: user.role ?? "user",
    locale: user.locale ?? "es",
    isAlquimista: user.isAlquimista ?? false,
    alquimistaCheckedAt: user.alquimistaCheckedAt ?? null,
  };
}

export async function getViewer(): Promise<Viewer | null> {
  return toViewer(await getCurrentUser());
}
