import connectToDB from "@/config/db";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";
import postViews from "@/models/postViews";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params; 

    // check user is login
     const currentUser =await getCurrentUser()
   

    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        { message: "شناسه پست نامعتبر است!" },
        { status: 404 },
      );
    }
    
    // valid post
    const post = await postsModel.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      return Response.json(
        { message: "چنین پستی وجود ندارد!" },
        { status: 404 },
      );
    }

    
    const [repostCount, likeCount, viewsCount, replyCount] = await Promise.all([
      postsModel.countDocuments({
        retweetedFrom: postId,
        isDeleted: false,
      
      }),
      postLikesModel.countDocuments({ postId }),
      postViews.countDocuments({ post: postId }),
      postsModel.countDocuments({
        replyToPost: postId,
        retweetedFrom: null, 
      }),
    ]);

    // check is current user liked and repost
    let isLiked = null;
    let isRepost = null;
    if (currentUser?._id) {
      [isLiked, isRepost] = await Promise.all([
        postLikesModel.findOne({ postId, userId: currentUser._id }),
        postsModel.findOne({
          retweetedFrom: postId,
          quoteContent: null, 
          author: currentUser._id,
          isDeleted: false,
        }),
      ]);
    }

    return Response.json(
      {
        likes: {
          likeCount,
          isLiked: !!isLiked,
        },
        reposts: {
          repostCount,
          isUserReposted: !!isRepost,
        },
        replyCount,
        replySetting: post.replySettings ?? "all",
        views: { viewsCount },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};