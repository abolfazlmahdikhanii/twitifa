import PostCard from "@/components/Posts/PostCard";
import UserReplies from "@/components/UserPage/UserReplies";
import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getUserReply } from "@/services/userReplyService";
import { verifyToken } from "@/utils/auth";
import { getAuthorName, getReplyHeader } from "@/utils/post";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
const RepliesPage = async ({ params }) => {
  await connectToDB();
  const token = (await cookies()).get("token");
  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username },"_id");
  if (!username) {
    notFound();
  }
  // check user is login
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
  const repliesRes=await getUserReply(userInfo,currentUser)
  
  const userPosts = JSON.parse(JSON.stringify(repliesRes));
  return (
    <>
      <UserReplies initialReplies={userPosts} username={username} />
    </>
  );
};

export default RepliesPage;
