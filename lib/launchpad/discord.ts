import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { account, user } from "@/lib/db/schema";
import { env } from "@/lib/env";
import { ALQUIMISTA_CHECK_TTL_MS } from "./constants";
import {
  DEV_DISCORD_API_BASE,
  DEV_DISCORD_GUILD_ID,
  DEV_DISCORD_PROVIDER_ID,
} from "./dev-services";

const isEmulated = (providerId: string) =>
  providerId === DEV_DISCORD_PROVIDER_ID;

const apiBaseFor = (providerId: string) =>
  isEmulated(providerId) ? DEV_DISCORD_API_BASE : env.DISCORD_API_BASE;

const guildIdFor = (providerId: string) =>
  isEmulated(providerId) ? DEV_DISCORD_GUILD_ID : env.DISCORD_GUILD_ID;

export async function hasDiscordAccount(userId: string) {
  return (await findDiscordAccount(userId)) !== null;
}

export type MembershipResult =
  | { status: "member"; discordUserId: string; roles: string[] }
  | { status: "not-member"; discordUserId: string }
  | { status: "not-linked" }
  | { status: "already-claimed" }
  | { status: "unavailable" };

interface DiscordAccount {
  accountId: string;
  id: string;
  providerId: string;
}

async function findDiscordAccount(
  userId: string
): Promise<DiscordAccount | null> {
  const rows = await db
    .select({
      id: account.id,
      accountId: account.accountId,
      providerId: account.providerId,
    })
    .from(account)
    .where(eq(account.userId, userId));

  const discord =
    rows.find((row) => row.providerId === "discord") ??
    rows.find((row) => row.providerId === DEV_DISCORD_PROVIDER_ID);

  return discord
    ? {
        id: discord.id,
        accountId: discord.accountId,
        providerId: discord.providerId,
      }
    : null;
}

const NOT_MEMBER_STATUS = 404;

export async function checkGuildMembership(
  userId: string
): Promise<MembershipResult> {
  const discordAccount = await findDiscordAccount(userId);

  if (!discordAccount) {
    return { status: "not-linked" };
  }

  const tokenResult = (await auth.api
    .getAccessToken({
      body: { accountId: discordAccount.id, userId },
      headers: await headers(),
    })
    .catch(() => null)) as { accessToken?: string } | null;

  const accessToken = tokenResult?.accessToken;

  if (!accessToken) {
    return { status: "unavailable" };
  }

  const response = await fetch(
    `${apiBaseFor(discordAccount.providerId)}/users/@me/guilds/${guildIdFor(discordAccount.providerId)}/member`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  ).catch(() => null);

  if (!response) {
    return { status: "unavailable" };
  }

  if (response.status === NOT_MEMBER_STATUS) {
    return { status: "not-member", discordUserId: discordAccount.accountId };
  }

  if (!response.ok) {
    return { status: "unavailable" };
  }

  const member = (await response.json()) as { roles?: string[] };

  return {
    status: "member",
    discordUserId: discordAccount.accountId,
    roles: member.roles ?? [],
  };
}

async function isClaimedByAnotherUser(
  discordUserId: string,
  userId: string
): Promise<boolean> {
  const [row] = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(user.discordUserId, discordUserId), ne(user.id, userId)))
    .limit(1);

  return Boolean(row);
}

export async function refreshAlquimistaBadge(userId: string) {
  const result = await checkGuildMembership(userId);

  if (result.status === "unavailable") {
    const [current] = await db
      .select({ isAlquimista: user.isAlquimista })
      .from(user)
      .where(eq(user.id, userId));

    return { isAlquimista: current?.isAlquimista ?? false, result };
  }

  const discordUserId = "discordUserId" in result ? result.discordUserId : null;

  if (discordUserId && (await isClaimedByAnotherUser(discordUserId, userId))) {
    return {
      isAlquimista: false,
      result: { status: "already-claimed" } as MembershipResult,
    };
  }

  const isAlquimista = result.status === "member";

  await db
    .update(user)
    .set({
      isAlquimista,
      alquimistaCheckedAt: new Date(),
      discordUserId,
    })
    .where(eq(user.id, userId));

  return { isAlquimista, result };
}

export function isBadgeStale(checkedAt: Date | null | undefined) {
  if (!checkedAt) {
    return true;
  }

  return Date.now() - checkedAt.getTime() > ALQUIMISTA_CHECK_TTL_MS;
}
