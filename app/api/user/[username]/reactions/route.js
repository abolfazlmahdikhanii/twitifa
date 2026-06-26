import connectToDB from "@/config/db";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getUserLikedPosts } from "@/services/userReactionsService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { username } = await params;
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");
    // get user info
    const userInfo = await usersModel.findOne({ username }, "");
    if (!username) {
      return Response.json(
        { message: "چنین کاربری یافت نشد!" },
        { status: 404 },
      );
    }
    // check user is login
    const currentUser =await getCurrentUser()
  

    const posts = await getUserLikedPosts(userInfo, currentUser, cursor, limit);

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
