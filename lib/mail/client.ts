import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY, {
      ...(env.RESEND_BASE_URL ? { baseUrl: env.RESEND_BASE_URL } : {}),
    })
  : null;

export const FROM_EMAIL = env.RESEND_FROM_EMAIL;
