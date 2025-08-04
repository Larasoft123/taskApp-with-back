import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { Session } from "@/utils/db/session";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let userId: string | null | Response = searchParams.get("userId");

  if (!userId) {
    userId = await Session.getUserId(request);
    if (typeof userId !== "string") return userId;
  }

  if (!userId) return new Response("userId is required", { status: 400 });

  try {
    const tags = await db.tags.findMany({
      where: {
        userId,
      },
      include: {
        tasks: true,
        notes: true,
      },

      omit: {
        userId: true,
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
