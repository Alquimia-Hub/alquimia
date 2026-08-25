export function withUtm(url: string, content: string) {
  try {
    const target = new URL(url);

    if (target.searchParams.has("utm_source")) {
      return target.href;
    }

    target.searchParams.set("utm_source", "alquimia");
    target.searchParams.set("utm_medium", "referral");
    target.searchParams.set("utm_campaign", "launchpad");
    target.searchParams.set("utm_content", content);

    return target.href;
  } catch {
    return url;
  }
}
