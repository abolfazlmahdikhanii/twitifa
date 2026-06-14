import PostInfoPage from "@/components/PostInfoPage/PostInfoPage";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { getPostInfo } from "@/services/postInfoService";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

const page = async ({ params }) => {
    const {postID}=await params
  await connectToDB()
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
    if(!isValidObjectId(postID)){
        return notFound()
    }
  const posts=await getPostInfo(postID,currentUser)

  return (
    <div>
      <PageHeader title="پست" />

      <PostInfoPage initialPosts={JSON.parse(JSON.stringify(posts))} postId={postID}/>
    </div>
  );
};

export default page;
