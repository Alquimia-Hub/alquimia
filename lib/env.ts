import { z } from "zod";
import { DEV_DISCORD_GUILD_ID } from "./launchpad/dev-services";
import { deploymentUrl } from "./site-url";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),

  BETTER_AUTH_SECRET: z.string().min(1),
  BETTER_AUTH_URL: z.url(),

  BETTER_AUTH_API_KEY: z.string().optional(),
  BETTER_AUTH_API_URL: z.url().optional(),
  BETTER_AUTH_KV_URL: z.url().optional(),

  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),
  DISCORD_GUILD_ID: z.string().default(DEV_DISCORD_GUILD_ID),

  DISCORD_API_BASE: z.url().default("https://discord.com/api/v10"),

  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("Alquimia <onboarding@resend.dev>"),
  RESEND_ADMIN_EMAIL: z.email().optional(),
  RESEND_BASE_URL: z.url().optional(),

  ADMIN_EMAILS: z.string().default(""),
});

const parsed = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || deploymentUrl(),
  BETTER_AUTH_API_KEY: process.env.BETTER_AUTH_API_KEY || undefined,
  BETTER_AUTH_API_URL: process.env.BETTER_AUTH_API_URL || undefined,
  BETTER_AUTH_KV_URL: process.env.BETTER_AUTH_KV_URL || undefined,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || undefined,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || undefined,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || undefined,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || undefined,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID || undefined,
  DISCORD_API_BASE: process.env.DISCORD_API_BASE || undefined,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN || undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || undefined,
  RESEND_ADMIN_EMAIL: process.env.RESEND_ADMIN_EMAIL || undefined,
  RESEND_BASE_URL: process.env.RESEND_BASE_URL || undefined,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || undefined,
});

if (!parsed.success) {
  throw new Error(
    `Variables de entorno invalidas:\n${z.prettifyError(parsed.error)}`
  );
}

export const env = parsed.data;

export const ADMIN_EMAIL_LIST = env.ADMIN_EMAILS.split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
