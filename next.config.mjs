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
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
