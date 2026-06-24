import HashtagPage from "@/components/HashtagPage/HashtagPage";
import connectToDB from "@/config/db";
import hashtagModel from "@/models/hashtag";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getHashtagPosts } from "@/services/hashtagServce";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

const HashtagsPage = async ({ params }) => {
  await connectToDB();
  const { hashtagName: encodeName } = await params;
  const token = (await cookies()).get("token");

  const hashtagName = decodeURIComponent(encodeName);
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
  const posts = await getHashtagPosts(hashtagName, currentUser);
  return (
    <div className="grid grid-cols-1 h-[calc(100vh-120px)]">
      <HashtagPage
        initialPosts={JSON.parse(JSON.stringify(posts))}
        hashtagName={hashtagName}
      />
    </div>
  );
};

export default HashtagsPage;
