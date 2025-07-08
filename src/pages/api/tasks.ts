import { type APIRoute } from "astro";
import { db } from "@/lib/db";

export const GET: APIRoute = async ({params,request}) => {
    console.log(params);
    console.log(request);

    const result = await db.tasks.findMany()

     console.log(result);






  return new Response(JSON.stringify(result));
};



