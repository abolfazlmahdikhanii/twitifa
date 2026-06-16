import PostQuotePage from "@/components/PostQuotePage/PostQuotePage";
import RepostClientPage from "@/components/RepostClientPage/RepostClientPage";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getRepostUsers } from "@/services/repostsService";

import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const RepostsPage = async ({ params }) => {
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
  const reposts = await getRepostUsers(postID, currentUser);

  return (
    <RepostClientPage
      initialUsers={JSON.parse(JSON.stringify(reposts))}
      username={username}
      postId={postID}
    />
  );
};

export default RepostsPage;
