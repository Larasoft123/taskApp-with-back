import { defineMiddleware } from "astro:middleware";
import { getSession } from "auth-astro/server";

const protectedRoutes = [/\/dashboard/,/\/notes/,/\/tasks/,/\/task\/\d+/,/api/];
const authRoute = "/auth";


// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(
  async ({ request, originPathname, redirect, url }, next) => {
    const pathname = originPathname;
    const session = await getSession(request);


    if (pathname === authRoute && session) {
      return redirect("/dashboard");
    }


    if (protectedRoutes.some((route) => route.test(pathname)) && !session) {
    
      return redirect(`/auth`);
    }

    return next();
  }
);
