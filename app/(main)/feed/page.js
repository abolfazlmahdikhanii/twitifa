import HomeClient from "@/components/main/HomeClient";

import connectToDB from "@/config/db";

import usersModel from "@/models/users";
import { getFeed } from "@/services/feedService";
import { verifyToken } from "@/utils/auth";

import { cookies } from "next/headers";
export const metadata = {
  title: "Home/Twitifa",
};
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
  const posts = await getFeed(currentUser);

  return (
    <div className="grid grid-cols-1 h-full">
      <HomeClient initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default HomePage;
