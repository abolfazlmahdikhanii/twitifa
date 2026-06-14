import PostCard from "@/components/Posts/PostCard";
import UserPosts from "@/components/UserPage/UserPosts";
import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getUserPosts } from "@/services/userPostsService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import React from "react";

const UserPage = async ({ params }) => {
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
  const posts=await getUserPosts(userInfo,currentUser)

  const userPosts = JSON.parse(JSON.stringify(posts));
  return (
    <>
      <UserPosts initialPosts={userPosts} username={username} />
    </>
  );
};

export default UserPage;
