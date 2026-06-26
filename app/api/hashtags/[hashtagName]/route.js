import hashtagModel from "@/models/hashtag";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getHashtagPosts } from "@/services/hashtagServce";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

const { default: connectToDB } = require("@/config/db");

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { hashtagName } = await params;
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");

    const currentUser =await getCurrentUser()
  
    const posts = await getHashtagPosts(hashtagName, currentUser, cursor, limit);

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
