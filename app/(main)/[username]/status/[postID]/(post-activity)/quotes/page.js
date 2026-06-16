import PostQuotePage from "@/components/PostQuotePage/PostQuotePage";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getQuotes } from "@/services/postQuoteService";

import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const QuotePage = async ({ params }) => {
  const { postID, username } = await params;

  if (!isValidObjectId(postID)) {
    return notFound();
  }

  await connectToDB();

  const token = (await cookies()).get("token");
  let currentUser = null;

  if (token && token.value) {
    const validToken = verifyToken(token.value);
    if (validToken) {
      currentUser = await usersModel
        .findOne(
          { email: validToken.email },
          "-provider -password -emailVerified -updatedAt",
        )
        .lean();
    }
  }
  const quotes = await getQuotes(postID, currentUser);

  return (
    <PostQuotePage
      initialPosts={JSON.parse(JSON.stringify(quotes))}
      username={username}
      postId={postID}
    />
  );
};

export default QuotePage;
