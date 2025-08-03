import { getSession } from "auth-astro/server";

export class Session {
  static async getUserId(request: Request) {
    const session = await getSession(request);

    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const { user } = session;
    const id = user?.id;

    if (!user || !id) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    return id;
  }



}
