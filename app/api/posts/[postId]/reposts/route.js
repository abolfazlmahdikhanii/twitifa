import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getRepostUsers } from "@/services/repostsService";

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
      const currentUser =await getCurrentUser()
    

    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    const result = await getRepostUsers(postId, currentUser, cursor, limit);

    return Response.json(
      {
        users: result.users,
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
