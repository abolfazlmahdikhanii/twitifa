import HomeClient from "@/components/main/HomeClient";

import connectToDB from "@/config/db";

import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getFeed } from "@/services/feedService";
import { verifyToken } from "@/utils/auth";

import { cookies } from "next/headers";
export const metadata = {
  title: "Home/Twitifa",
};
const HomePage = async () => {
  await connectToDB();
   const currentUser =await getCurrentUser()
 
  const posts = await getFeed(currentUser);

  return (
    <div className="grid grid-cols-1 h-full">
      <HomeClient initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default HomePage;
