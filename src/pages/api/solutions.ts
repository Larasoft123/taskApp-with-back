import { type APIRoute } from "astro";

import { db } from "@/lib/db";
import { Session } from "@/utils/db/session";

export const GET: APIRoute = async ({ request }) => {
  const userId = await Session.getUserId(request);
  if (typeof userId !== "string") return userId;
  const noteId = 0;

  try {
    const solutions = await db.solutions.findMany({
      where: {
        noteId,
      },
    });

    return new Response(JSON.stringify(solutions));
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const userId = await Session.getUserId(request);

  if (typeof userId !== "string") return userId;
  const data = await request.json();

  const newData = {
    title: data.title,
    content: data.content,
    noteId: data.id,
  };

  try {
    const solution = await db.solutions.create({
      data: newData,
    });
    return new Response(JSON.stringify(solution));
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
