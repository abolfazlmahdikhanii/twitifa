import UserMedia from "@/components/UserPage/UserMedia";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getMedia } from "@/services/twittvService";
import { getUserMedia } from "@/services/userMediaService";
import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
const UserMediaPage = async ({ params }) => {
  await connectToDB();

  const { username } = await params;

  // get user info
  const userInfo = await usersModel.findOne({ username }, "_id");
  if (!username) {
    notFound();
  }
  // check user is login
  const currentUser = await getCurrentUser();

  const posts = await getUserMedia(userInfo, currentUser);

  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserMedia initialPosts={userPosts} username={username} />
    </>
  );
};

export default UserMediaPage;
