import { dash, sentinel } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, oAuthProxy } from "better-auth/plugins";
import { eq } from "drizzle-orm";
import type { EmailLocale } from "@/emails/copy";
import { devOAuthPlugins } from "@/lib/auth-dev-providers";
import { SITE_URL } from "@/lib/constants";
import { db, schema } from "@/lib/db";
import { ADMIN_EMAIL_LIST, env } from "@/lib/env";
import { DISCORD_SCOPES } from "@/lib/launchpad/discord-scopes";
import { sendWelcomeEmail } from "@/lib/mail/send";
import {
  deploymentUrl,
  isPreviewDeployment,
  isProductionDeployment,
} from "@/lib/site-url";

const CLIENT_IP_HEADERS = ["x-vercel-forwarded-for", "x-forwarded-for"];

const ENGLISH_LOCALE_COOKIE = /(?:^|;\s*)NEXT_LOCALE=en(?:;|$)/;
const ENGLISH_REFERER_PATH = /^https?:\/\/[^/]+\/en(?:\/|$|\?)/;
const ENGLISH_ACCEPT_LANGUAGE = /(?:^|,)\s*en\b/i;
const SPANISH_ACCEPT_LANGUAGE = /(?:^|,)\s*es\b/i;

function realSocialProviders() {
  return {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    ...(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET
      ? {
          discord: {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
            scope: DISCORD_SCOPES,
          },
        }
      : {}),
  };
}

function oauthProxyPlugins() {
  if (!isPreviewDeployment()) {
    return [];
  }

  return [oAuthProxy({ productionURL: SITE_URL, currentURL: deploymentUrl() })];
}

function infraPlugins() {
  if (!(env.BETTER_AUTH_API_KEY && isProductionDeployment())) {
    return [];
  }

  const connection = {
    apiKey: env.BETTER_AUTH_API_KEY,
    ...(env.BETTER_AUTH_API_URL ? { apiUrl: env.BETTER_AUTH_API_URL } : {}),
    ...(env.BETTER_AUTH_KV_URL ? { kvUrl: env.BETTER_AUTH_KV_URL } : {}),
  };

  return [
    dash(connection),
    sentinel({
      ...connection,
      security: {
        botBlocking: true,
        suspiciousIpBlocking: true,
        emailValidation: { enabled: true, strictness: "medium" },
      },
    }),
  ];
}

const isSeedAdminEmail = (email: string) =>
  ADMIN_EMAIL_LIST.includes(email.toLowerCase());

async function syncSeedAdminRole(userId: string) {
  const [current] = await db
    .select({ email: schema.user.email, role: schema.user.role })
    .from(schema.user)
    .where(eq(schema.user.id, userId))
    .limit(1);

  if (
    !current ||
    current.role === "admin" ||
    !isSeedAdminEmail(current.email)
  ) {
    return;
  }

  await db
    .update(schema.user)
    .set({ role: "admin" })
    .where(eq(schema.user.id, userId));
}

const readLocaleFromHeaders = (headers?: Headers): EmailLocale => {
  if (!headers) {
    return "es";
  }

  const cookie = headers.get("cookie") ?? "";

  if (ENGLISH_LOCALE_COOKIE.test(cookie)) {
    return "en";
  }

  if (ENGLISH_REFERER_PATH.test(headers.get("referer") ?? "")) {
    return "en";
  }

  const acceptLanguage = headers.get("accept-language") ?? "";

  if (
    ENGLISH_ACCEPT_LANGUAGE.test(acceptLanguage) &&
    !SPANISH_ACCEPT_LANGUAGE.test(acceptLanguage)
  ) {
    return "en";
  }

  return "es";
};

export const auth = betterAuth({
  appName: "Alquimia Launchpad",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, { provider: "pg", schema }),

  advanced: {
    ipAddress: {
      ipAddressHeaders: CLIENT_IP_HEADERS,
    },
  },

  socialProviders: realSocialProviders(),

  account: {
    accountLinking: {
      enabled: true,

      allowDifferentEmails: true,
    },
  },

  user: {
    additionalFields: {
      locale: {
        type: "string",
        required: false,
        defaultValue: "es",
        input: false,
      },
      isAlquimista: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      alquimistaCheckedAt: {
        type: "date",
        required: false,
        input: false,
      },
      discordUserId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: (newUser, ctx) =>
          Promise.resolve({
            data: {
              ...newUser,
              role: isSeedAdminEmail(newUser.email) ? "admin" : "user",
              locale: readLocaleFromHeaders(ctx?.headers),
            },
          }),
        after: async (createdUser, ctx) => {
          await sendWelcomeEmail({
            to: createdUser.email,
            name: createdUser.name,
            locale: readLocaleFromHeaders(ctx?.headers),
          });
        },
      },
    },
    session: {
      create: {
        before: async (newSession) => {
          await syncSeedAdminRole(newSession.userId);
          return { data: newSession };
        },
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    ...infraPlugins(),
    ...oauthProxyPlugins(),
    ...devOAuthPlugins(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
