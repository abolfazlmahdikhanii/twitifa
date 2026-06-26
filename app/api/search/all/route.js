import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getSearchResult } from "@/services/searchService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");
    const search = searchParams.get("q");
    const type = searchParams.get("type");

    // check user is login
    const currentUser =await getCurrentUser()
  
    
    const result = await getSearchResult(
      search,
      currentUser,
      cursor,
      limit,
      type,
    );

    return Response.json(
      {
        result: result.result, 
        matchedUsers: result.matchedUsers,
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