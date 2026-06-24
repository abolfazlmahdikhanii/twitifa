import ExplorerClient from "@/components/Explorer/ExplorerClient";

import connectToDB from "@/config/db";

import usersModel from "@/models/users";
import { getExplorer } from "@/services/explorerService";
import { verifyToken } from "@/utils/auth";

import { cookies } from "next/headers";

const ExplorerPage = async () => {
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
  const posts = await getExplorer(currentUser);

  return (
    <div className="grid grid-cols-1 h-full">
      <ExplorerClient initialPosts={JSON.parse(JSON.stringify(posts))} />
    </div>
  );
};

export default ExplorerPage;
