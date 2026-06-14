import UserRePosts from "@/components/UserPage/UserRePosts";
import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getUserRePosts } from "@/services/userRepostsService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const RepostsPage = async ({ params }) => {
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
 const posts=await getUserRePosts(userInfo,currentUser)
  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserRePosts initialPosts={userPosts} username={username} />
    </>
  );
};

export default RepostsPage;
