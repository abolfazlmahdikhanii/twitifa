import connectToDB from "@/config/db";
import usersModel from "@/models/users";
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

    let currentUser = null;
    if (token && token.value) {
      const validToken = verifyToken(token?.value);
      if (!validToken) currentUser = null;
      currentUser = await usersModel
        .findOne(
          { email: validToken.email },
          " -provider -password -emailVerified -updatedAt",
        )
        .lean();
    }
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
