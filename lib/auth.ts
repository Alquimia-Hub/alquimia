import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, oAuthProxy } from "better-auth/plugins";
import type { EmailLocale } from "@/emails/copy";
import { devOAuthPlugins } from "@/lib/auth-dev-providers";
import { SITE_URL } from "@/lib/constants";
import { db, schema } from "@/lib/db";
import { ADMIN_EMAIL_LIST, env } from "@/lib/env";
import { DISCORD_SCOPES } from "@/lib/launchpad/discord-scopes";
import { sendWelcomeEmail } from "@/lib/mail/send";
import { deploymentUrl, isPreviewDeployment } from "@/lib/site-url";

const ENGLISH_LOCALE_COOKIE = /(?:^|;\s*)NEXT_LOCALE=en(?:;|$)/;

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

const readLocaleFromHeaders = (headers?: Headers): EmailLocale => {
  const cookie = headers?.get("cookie") ?? "";
  return ENGLISH_LOCALE_COOKIE.test(cookie) ? "en" : "es";
};

export const auth = betterAuth({
  appName: "Alquimia Launchpad",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, { provider: "pg", schema }),

  socialProviders: realSocialProviders(),

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "discord"],

      allowDifferentEmails: true,
    },
  },

  user: {
    additionalFields: {
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
        before: (newUser) => {
          const isSeedAdmin = ADMIN_EMAIL_LIST.includes(
            newUser.email.toLowerCase()
          );

          return Promise.resolve({
            data: { ...newUser, role: isSeedAdmin ? "admin" : "user" },
          });
        },
        after: async (createdUser, ctx) => {
          await sendWelcomeEmail({
            to: createdUser.email,
            name: createdUser.name,
            locale: readLocaleFromHeaders(ctx?.headers),
          });
        },
      },
    },
  },

  plugins: [
    admin(),
    ...oauthProxyPlugins(),
    ...devOAuthPlugins(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type SessionUser = Session["user"];
