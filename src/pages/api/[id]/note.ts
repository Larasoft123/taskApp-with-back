import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { getUserSession } from "@/utils/auth/getSession";

export const DELETE: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });

  const { userId } = await getUserSession(request);

  if (!userId) return new Response("userId is required", { status: 400 });

  try {
    const result = await db.notes.delete({
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