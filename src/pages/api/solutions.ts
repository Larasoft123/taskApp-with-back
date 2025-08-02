import { type APIRoute } from "astro";
import { getSession } from "auth-astro/server";
import { db } from "@/lib/db";

export const GET: APIRoute = async ({ request }) => {
  const userId = await Validations.userId(request);
  console.log(userId );
  if (typeof userId !== "string") {
    return userId;
  }
  const noteId= 0


  try {


    const solutions = await db.solutions.findMany({
        where: {
            noteId
        }
    })

    return new Response(JSON.stringify(solutions));
    
  } catch (e) {
    return new Response("Internal Server Error", {
      status: 500,
    });
    
  }


  


};

export const POST: APIRoute = async ({ request }) => {
  const userId = await Validations.userId(request);

  if (typeof userId !== "string") {
    return userId;
  }
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

class Validations {
  static async userId(request: Request) {
    const session = await getSession(request);

    if (!session) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const { user } = session;
    const id = user?.id;

    if (!user || !id) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    return id;
  }
}
