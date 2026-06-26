import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getMedia } from "@/services/twittvService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;

    const filter = searchParams.get("filter");
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    const currentUser =await getCurrentUser()
  
    const posts = await getMedia(
      currentUser,
      cursor,
      limit,
      filter
    );

    return Response.json(
      {
        posts: posts.posts,
        hasMore: posts.hasMore,
        nextCursor: posts.nextCursor,
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
