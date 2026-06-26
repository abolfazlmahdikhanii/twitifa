import UserReactions from "@/components/UserPage/UserReactions";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getUserLikedPosts } from "@/services/userReactionsService";
import { notFound } from "next/navigation";

const ReactionPage = async ({ params }) => {
  await connectToDB();

  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username }, "_id");
  if (!username) {
    notFound();
  }
  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getUserLikedPosts(userInfo, currentUser);

  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserReactions initialPosts={userPosts} username={username} />
    </>
  );
};

export default ReactionPage;
