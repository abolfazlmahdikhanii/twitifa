import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getUserReply } from "@/services/userReplyService";
import { verifyToken } from "@/utils/auth";
import { getAuthorName, getReplyHeader } from "@/utils/post";
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
    const userInfo = await usersModel.findOne({ username },"_id");
    if (!userInfo) {
      return Response.json(
        { message: "چنین کاربری یافت نشد!" },
        { status: 404 },
      );
    }

    // check user is login
    let currentUser = null;
    if (token && token.value) {
      const validToken = verifyToken(token?.value);
      if (validToken) {
        currentUser = await usersModel
          .findOne(
            { email: validToken.email },
            " -provider -password -emailVerified -updatedAt",
          )
          .lean();
      }
    }
    const repliesRes = await getUserReply(userInfo, currentUser, cursor, limit);

    return Response.json(
      {
        posts: repliesRes.posts,
        hasMore: repliesRes.hasMore,
        nextCursor: repliesRes.nextCursor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("User replies API error:", error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
