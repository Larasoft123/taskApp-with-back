import { type APIRoute } from "astro";
import { db } from "@/lib/db";
import { getUserSession } from "@/utils/auth/getSession";

function getUrlParams(url: string) {
  const pattern = "[&|?]([a-zA-Z0-9._%-]+)=([a-zA-Z0-9._%-]+)";

  const answer = Array.from(url.matchAll(pattern as any));

  return answer.map((match) => {
    const [complete, key, value] = match;
    return { complete, key, value };
  });
}


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GET: APIRoute = async ({ request }) => {
  const params = getUrlParams(request.url);
  const userId = params.find((param) => param.key === "userId")?.value;

  if (!userId) return new Response("userId is required", { status: 400 });

  

  const result = await db.tasks.findMany({
    where: {
      userId,
    },
  });


  await delay(5000);


  return new Response(JSON.stringify(result));
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { title, description, status, type } = body;

  const { userId } = await getUserSession(request);
  if (!userId) return new Response("userId is required", { status: 400 });

  const data = {
    userId,
    title,
    description,
    status,
    type,
  };

  try {
    const result = await db.tasks.create({
      data,
    });
    console.log({ result });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
