import connectToDB from "@/config/db";
import notifyModel from "@/models/notifications";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params;
    const body = await req.json();
    const { quoteContent } = body;

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate user

    const validToken = verifyToken(token?.value);

    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // get author info
    const currentUser = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!currentUser) {
      return Response.json(
        {
          message: "چنین کاربری با این ایمیل و نام کاربری وجودندارد!",
        },
        { status: 404 },
      );
    }

    // validate content
    if (quoteContent && quoteContent.trim() === "") {
      return Response.json(
        {
          message: "نقل قول خالی است!",
        },
        { status: 400 },
      );
    }
    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    // valid post
    const post = await postsModel
      .findOne({ _id: postId, isDeleted: false })
      .populate("author", "_id");
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }
    if (!quoteContent) {
      const alreadyReposted = await postsModel.findOne({
        retweetedFrom: postId,
        author: currentUser._id,
        quoteContent: null,
        isDeleted: false,
      });

      if (alreadyReposted) {
        // await postsModel.findOneAndUpdate(
        //   { _id: alreadyReposted._id },
        //   { isDeleted: true },
        // );
        await postsModel.deleteOne({ _id: alreadyReposted._id });
        await postLikesModel.deleteMany({ postId: alreadyReposted._id });
        await notifyModel.findOneAndUpdate(
          {
            recipientId: post.author._id,
            type: "retweet",

            entityId: post._id,
            entityType: "post",
          },
          {
            $pull: { actorIds: currentUser._id },
          },
        );
        return Response.json(
          { message: "بازنشر پست حذف شد", reposted: false },
          { status: 200 },
        );
      }
    }
    // update post
    const newPost = await postsModel.create({
      retweetedFrom: postId,
      originalAuthor: post.author,
      quoteContent: quoteContent?.trim() || null,
      author: currentUser._id,
      replySettings: "all",
    });
    if (!newPost) {
      return Response.json(
        {
          message: "بازنشر پست با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }
    if (currentUser._id.toString() !== post.author._id.toString()) {
      const existing = await notifyModel.findOne({
        recipientId: post.author._id,
        type: quoteContent ? "quote" : "retweet",
        isRead: false,
        entityId: post._id,
        entityType: "post",
      });
      if (existing) {
        await notifyModel.updateOne(
          {
            _id: existing._id,
            recipientId: post.author._id,
            type: quoteContent ? "quote" : "retweet",
            isRead: false,
            entityId: post._id,
            entityType: "post",
          },
          {
            $addToSet: { actorIds: currentUser._id },
          },
        );
      } else {
        if (currentUser._id.toString() !== post.author._id.toString()) {
          await notifyModel.create({
            recipientId: post.author._id,
            type: quoteContent ? "quote" : "retweet",
            actorIds: [currentUser._id],
            entityId: post._id,
            entityType: "post",
          });
        }
      }
    }

    return Response.json(
      { message: "بازنشر پست با موفقیت انجام شد" },
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
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params;

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
    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    // valid post
    const post = await postsModel.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }
    // count repost
    const repostCount = await postsModel.countDocuments({
      retweetedFrom: postId,
    });
    // check is current user repost
    let isRepost = null;
    if (currentUser) {
      isRepost = await postsModel.findOne({
        retweetedFrom: postId,
        author: currentUser._id,
        isDeleted: false,
      });
    }

    return Response.json(
      {
        repostCount,
        isUserReposted: !!isRepost,
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
