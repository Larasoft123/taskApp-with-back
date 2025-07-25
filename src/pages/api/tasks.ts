import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { getUserSession } from "@/utils/auth/getSession";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) return new Response("userId is required", { status: 400 });

  const result = await db.tasks.findMany({
    where: {
      userId,
    },
  });

  // await delay(50);

  return new Response(JSON.stringify(result));
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { title, description, status, type, tags } = body;

  const { userId } = await getUserSession(request);
  if (!userId) return new Response("userId is required", { status: 400 });

  const data = {
    userId,
    title,
    description,
    status,
    type,
    tags: { connect: tags.map((tagId: number) => ({ id: tagId })) },
  };

  try {
    // crear tarea y relacionarla con los id de etiqueta pasados
    const result = await db.tasks.create({
      data
    });



    return new Response(JSON.stringify(result), { status: 200 });


  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
