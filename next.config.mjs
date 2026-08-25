import createNextIntlPlugin from "next-intl/plugin";

const socialProviders = [
  process.env.GOOGLE_CLIENT_ID && "google",
  process.env.DISCORD_CLIENT_ID && "discord",
]
  .filter(Boolean)
  .join(",");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SOCIAL_PROVIDERS: socialProviders,
    NEXT_PUBLIC_BETTER_AUTH_INFRA:
      process.env.BETTER_AUTH_API_KEY && process.env.VERCEL_ENV === "production"
        ? "1"
        : "",
    NEXT_PUBLIC_BETTER_AUTH_KV_URL: process.env.BETTER_AUTH_KV_URL ?? "",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
