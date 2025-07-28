import { db } from "@/lib/db";
import { getUserSession } from "@/utils/auth/getSession";
import { type APIRoute } from "astro";



export const GET: APIRoute = async ({ request }) => {
  const { userId } = await getUserSession(request);

  if (!userId) return new Response("userId is required", { status: 400 });

  try {
    const result = await db.notes.findMany({
      where: {
        userId,
      },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};


export const POST: APIRoute = async ({ request }) => {
  const { userId } = await getUserSession(request);
  const {tags,title,description,solutions} = await request.json()

  if (!userId) return new Response("userId is required", { status: 400 });


  const data = {
    userId,
    tags,
    title,
    description,
    solutions
  }

  try {
    const result = await db.notes.create({
      data
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};