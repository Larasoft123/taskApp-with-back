import { type APIRoute } from "astro";
import { db } from "@/lib/db";

import { Session } from "@/utils/db/session";

export const GET: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });
  const userId = await Session.getUserId(request);
  if (typeof userId !== "string") return userId;



  try {

    const result = await db.notes.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        tags: true,
      },
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
    
  }
};

export const DELETE: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });

  const userId = await Session.getUserId(request);

  if (typeof userId !== "string") return userId;

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

export const PATCH: APIRoute = async ({ request, params }) => {
  const id = Number(params.id);
  const body = await request.json();
  const { title, description, tags: newTags } = body;

  const userId = await Session.getUserId(request);
  if (typeof userId !== "string") return userId;

  const [tagsIds] = await db.notes.findMany({
    where: {
      id,
    },
    select: {
      tags: {
        select: {
          id: true,
        },
      },
    },
  });

  const { tags: oldTags } = tagsIds;

  const oldTagsIdsSet = new Set(oldTags.map((tag: any) => tag.id));
  const newTagsIdsSet = new Set(newTags);
  const tagsToDelete = oldTagsIdsSet.difference(newTagsIdsSet);
  const tagsToAdd = newTagsIdsSet.difference(oldTagsIdsSet);

  const data = {
    title,
    description,
    tags: {
      disconnect: [...tagsToDelete].map((tag: number) => ({ id: tag })),
      connect: [...tagsToAdd].map((tag: number) => ({ id: tag })),
    },
  };

  try {
    const result = await db.notes.update({
      data,

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
