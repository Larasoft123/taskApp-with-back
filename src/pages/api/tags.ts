import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { getUserSession } from "@/utils/auth/getSession";



export const GET: APIRoute = async ({ request }) => {
  try {
    const { userId } = await getUserSession(request);
    console.log({userId} );
    
    if (!userId) return new Response("userId is required", { status: 400 });


    const tags = await db.tags.findMany({
      where: {
        userId,
      },
    });
    console.log(tags );
    
    return new Response(JSON.stringify(tags));
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { name } = body;

  const { userId } = await getUserSession(request);
  if (!userId) return new Response("userId is required", { status: 400 });

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
