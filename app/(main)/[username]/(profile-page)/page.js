import UserPosts from "@/components/UserPage/UserPosts";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getUserPosts } from "@/services/userPostsService";
import { notFound } from "next/navigation";

const UserPage = async ({ params }) => {
  await connectToDB();

  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username }, "_id");
  if (!username) {
    notFound();
  }
  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getUserPosts(userInfo, currentUser);

  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserPosts initialPosts={userPosts} username={username} />
    </>
  );
};

export default UserPage;
