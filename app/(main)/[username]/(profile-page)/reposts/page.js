import UserRePosts from "@/components/UserPage/UserRePosts";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getUserRePosts } from "@/services/userRepostsService";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
const RepostsPage = async ({ params }) => {
  await connectToDB();

  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username }, "_id");
  if (!username) {
    notFound();
  }
  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getUserRePosts(userInfo, currentUser);
  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserRePosts initialPosts={userPosts} username={username} />
    </>
  );
};

export default RepostsPage;
