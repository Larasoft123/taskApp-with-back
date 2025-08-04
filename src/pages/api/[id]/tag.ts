import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { Session } from "@/utils/db/session";

export const DELETE: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });

  
  const userId = await Session.getUserId(request);

   if (typeof userId !== "string") return userId;

  try {
    const result = await db.tags.delete({
      where: {
        id,
        userId,
      },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const GET: APIRoute = async ({ params, request }) => {

  const id = Number(params.id);
  if (!id) return new Response("id is required", { status: 400 });

   const userId = await Session.getUserId(request);

   if (typeof userId !== "string") return userId;

  try {
    const result = await db.tags.findUnique({
      where: {
        id,
        userId
      },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });
  const body = await request.json()
  const {name,color} = body

  const userId = await Session.getUserId(request);

  if (typeof userId !== "string") return userId;

  try {
    const result = await db.tags.update({
      where: {
        id,
        userId,
      },
      data: {
        name: name,

      },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};