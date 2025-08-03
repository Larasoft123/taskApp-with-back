import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { Session } from "@/utils/db/session";

export const DELETE: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);

  if (!id) return new Response("id is required", { status: 400 });

  const userId = await Session.getUserId(request);

  if (typeof userId !== "string") return userId;

  try {
    const result = await db.tasks.delete({
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
    const result = await db.tasks.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
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
  const { title, description, status, type, tags: newTags } = body;


  const userId = await Session.getUserId(request);
  if (typeof userId !== "string") return userId;

  const [tagsIds] = await db.tasks.findMany({
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
    status,
    type,
    tags: {
      disconnect: [...tagsToDelete].map((tag: number) => ({ id: tag })),
      connect: [...tagsToAdd].map((tag: number) => ({ id: tag })),
    },
  };

  try {
    const result = await db.tasks.update({
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
