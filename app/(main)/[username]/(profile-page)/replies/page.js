import UserReplies from "@/components/UserPage/UserReplies";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getUserReply } from "@/services/userReplyService";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";

const RepliesPage = async ({ params }) => {
  await connectToDB();

  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username }, "_id");
  if (!username) {
    notFound();
  }
  // check user is login
  const currentUser = await getCurrentUser();

  const repliesRes = await getUserReply(userInfo, currentUser);

  const userPosts = JSON.parse(JSON.stringify(repliesRes));
  return (
    <>
      <UserReplies initialReplies={userPosts} username={username} />
    </>
  );
};

export default RepliesPage;
