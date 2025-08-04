import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { TypeTask, Status } from "@prisma/client";

import { Session } from "@/utils/db/session";

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  let userId: string | null | Response = searchParams.get("userId");
  if (!userId) {
    userId = await Session.getUserId(request);
    if (typeof userId !== "string") return userId;
  }




  const type = searchParams.get("type") as TypeTask | null;
  const status = searchParams.get("status") as Status | null;

  if (!userId) return new Response("userId is required", { status: 400 });

  try {
    if (type && status) {
      const result = await db.tasks.findMany({
        where: {
          userId,
          type,
          status,
        },
        include: {
          tags: true,
        },
      });
      return new Response(JSON.stringify(result));
    }

    if (type) {
      const result = await db.tasks.findMany({
        where: {
          userId,
          type,
        },
        include: {
          tags: true,
        },
      });
      return new Response(JSON.stringify(result));
    }

    if (status) {
      const result = await db.tasks.findMany({
        where: {
          userId,
          status,
        },
        include: {
          tags: true,
        },
      });
      return new Response(JSON.stringify(result));
    }

    const result = await db.tasks.findMany({
      where: {
        userId,
      },
      include: {
        tags: true,
      },
    });

    return new Response(JSON.stringify(result));
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { title, description, status, type, tags } = body;

  const userId = await Session.getUserId(request);

  if (typeof userId !== "string") return userId;

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
      data,
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
