import HomeClient from "@/components/main/HomeClient";
import PostBox from "@/components/main/PostBox";
import PostCard from "@/components/Posts/PostCard";

import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import postsModel from "@/models/posts";

import usersModel from "@/models/users";
import { getFeed } from "@/services/feedService";
import { verifyToken } from "@/utils/auth";

import { ScrollShadow, Tabs } from "@heroui/react";
import { cookies } from "next/headers";
import { toast } from "sonner";

const HomePage = async () => {
  await connectToDB();
  const token = (await cookies()).get("token");
 
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
  const posts=await getFeed(currentUser)

 
 
  return (
    <div className="grid grid-cols-1 h-full">
      <HomeClient initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default HomePage;
