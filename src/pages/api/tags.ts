import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { Session } from "@/utils/db/session";

export const GET: APIRoute = async ({ request }) => {
  const userId = await Session.getUserId(request);

   if (typeof userId !== "string") return userId;

  try {
    const tags = await db.tags.findMany({
      where: {
        userId,
      },
    });

    return new Response(JSON.stringify(tags));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { name } = body;

  const userId = await Session.getUserId(request);

   if (typeof userId !== "string") return userId;

  const data = {
    userId,
    name,
  };

  try {
    const result = await db.tags.create({
      data,
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
