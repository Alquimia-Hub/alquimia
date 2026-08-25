import { genericOAuth } from "better-auth/plugins";
import {
  DEV_DISCORD_API_BASE,
  DEV_GOOGLE_BASE,
} from "@/lib/launchpad/dev-services";

const EMULATOR_CREDENTIALS = {
  google: {
    clientId: "alquimia-local.apps.googleusercontent.com",
    clientSecret: "GOCSPX-alquimia-local-secret",
  },
  discord: {
    clientId: "alquimia-local-discord",
    clientSecret: "alquimia-local-discord-secret",
  },
} as const;

async function fetchProfile<T>(url: string, accessToken: string | undefined) {
  if (!accessToken) {
    return null;
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  return response.ok ? ((await response.json()) as T) : null;
}

export function devOAuthPlugins() {
  if (process.env.NODE_ENV === "production") {
    return [];
  }

  return [
    genericOAuth({
      config: [
        {
          providerId: "google-dev",
          ...EMULATOR_CREDENTIALS.google,
          authorizationUrl: `${DEV_GOOGLE_BASE}/o/oauth2/v2/auth`,
          tokenUrl: `${DEV_GOOGLE_BASE}/oauth2/token`,
          userInfoUrl: `${DEV_GOOGLE_BASE}/oauth2/v2/userinfo`,
          scopes: ["openid", "email", "profile"],
          getUserInfo: async (tokens) => {
            const profile = await fetchProfile<{
              sub: string;
              email: string;
              name: string;
              picture?: string;
            }>(`${DEV_GOOGLE_BASE}/oauth2/v2/userinfo`, tokens.accessToken);

            if (!profile) {
              return null;
            }

            return {
              id: profile.sub,
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              emailVerified: true,
            };
          },
        },
        {
          providerId: "discord-dev",
          ...EMULATOR_CREDENTIALS.discord,
          authorizationUrl: `${DEV_DISCORD_API_BASE.replace("/api/v10", "")}/oauth2/authorize`,
          tokenUrl: `${DEV_DISCORD_API_BASE}/oauth2/token`,
          userInfoUrl: `${DEV_DISCORD_API_BASE}/users/@me`,
          scopes: ["identify", "email", "guilds.members.read"],
          getUserInfo: async (tokens) => {
            const profile = await fetchProfile<{
              id: string;
              username: string;
              global_name: string | null;
              email: string;
            }>(`${DEV_DISCORD_API_BASE}/users/@me`, tokens.accessToken);

            if (!profile) {
              return null;
            }

            return {
              id: profile.id,
              email: profile.email,
              name: profile.global_name ?? profile.username,
              emailVerified: true,
            };
          },
        },
      ],
    }),
  ];
}
