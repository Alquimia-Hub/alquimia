import { SITE_URL } from "./constants";

const LOCAL_URL = "http://localhost:3000";

const vercelUrl = () =>
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;

export function deploymentUrl(): string {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  if (process.env.VERCEL_ENV === "production") {
    return SITE_URL;
  }

  return vercelUrl() ?? LOCAL_URL;
}

export function publicUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_ENV === "production") {
    return SITE_URL;
  }

  return deploymentUrl();
}

export const isPreviewDeployment = () => process.env.VERCEL_ENV === "preview";

export const isProductionDeployment = () =>
  process.env.VERCEL_ENV === "production";
