"use client";

import { dashClient, sentinelClient } from "@better-auth/infra/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/lib/auth";

const infraEnabled = process.env.NEXT_PUBLIC_BETTER_AUTH_INFRA === "1";

const identifyUrl = process.env.NEXT_PUBLIC_BETTER_AUTH_KV_URL || undefined;

const infraClientPlugins = infraEnabled
  ? [
      dashClient(),
      sentinelClient({
        autoSolveChallenge: true,
        ...(identifyUrl ? { identifyUrl } : {}),
      }),
    ]
  : [];

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    ...infraClientPlugins,
  ],
});

export const { signIn, signOut, useSession, linkSocial, listAccounts } =
  authClient;
