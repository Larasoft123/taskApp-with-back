import { db } from "@/lib/db";

export const getUserById = async (id: string) => {
  try {
    const user = db.user.findFirst({
      where: {
        id,
      },
    });
  

    return user;
  } catch (error) {
    return null;
  }
};
