import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getExplorer } from "@/services/explorerService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";


export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");

    // check user is login
     const currentUser =await getCurrentUser()
   

    const result = await getExplorer(currentUser, cursor, limit);

    return Response.json(
      {
        posts: result.posts,
       
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
