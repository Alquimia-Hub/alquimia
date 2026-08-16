import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match every pathname except
  // - … those starting with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`, `/images/*.png`)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
