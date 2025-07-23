import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

const protectedRoutes = ["/dashboard"];
const authRoute = "/auth";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(
  async ({ request, originPathname, redirect, url }, next) => {
    const pathname = originPathname;
    const session = await getSession(request);

    console.log("session es ", session);
    console.log("pathname es ", pathname);

    if (pathname === authRoute && session) {
      return redirect("/dashboard");
    }

    if (protectedRoutes.includes(pathname) && !session) {
      return redirect(`/auth`);
    }

    return next();
  }
);
