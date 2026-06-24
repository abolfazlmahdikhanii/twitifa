import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getQuotes } from "@/services/postQuoteService";

import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { postId } = await params;

    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");
  

    // check user is login
    let currentUser = null;
    if (token && token.value) {
      const validToken = verifyToken(token?.value);
      if (!validToken) currentUser = null;

      if (validToken) {
        currentUser = await usersModel
          .findOne(
            { email: validToken.email },
            "-provider -password -emailVerified -updatedAt",
          )
          .lean();
      }
    }

    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    const result = await getQuotes(postId, currentUser, cursor, limit);

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
