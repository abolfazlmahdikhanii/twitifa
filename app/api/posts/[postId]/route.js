import connectToDB from "@/config/db";
import hashtagModel from "@/models/hashtag";
import notifyModel from "@/models/notifications";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { getPostInfo } from "@/services/postInfoService";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    const { postId } = await params;
    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // validate user
    const validToken = verifyToken(token.value);

    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // get author info
    const author = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!author) {
      return Response.json(
        {
          message: "چنین کاربری با این ایمیل و نام کاربری وجودندارد!",
        },
        { status: 404 },
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
    const post = await postsModel.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }

    // validate post author
    if (post.author.toString() !== author._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به این پست نیستید!",
        },
        { status: 403 },
      );
    }
    // remove trend
    const hashtags = post.textContent?.match(/#[\w\u0600-\u06FF]+/gi) || [];
    for (const hashtag of hashtags) {
      await hashtagModel.findOneAndUpdate(
        { hashtag },
        {
          $inc: { count: -1 },
          $pull: { posts: post._id },
        },
      );
    }
    // remove poll if exiting
    // await pollModel.deleteOne({ postId });
    // // remove like if exiting
    // await postLikesModel.deleteMany({ postId });
    // // remove replies if exiting
    // // await postsModel.deleteMany({ replyToPost: postId });
    // // remove post view
    // await postViews.deleteMany({ post: postId });
    // remove post
    await postsModel.findOneAndUpdate(
      { _id: postId },
      { isDeleted: true },
      { new: true },
    );
    // remove notification
    await notifyModel.deleteMany({
      entityId: post.retweetedFrom,
      entityType: "post",
    });

    return Response.json({ message: "پست با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
export const PUT = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params;
    const body = await req.json();
    const { textContent } = body;

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate user

    const validToken = verifyToken(token.value);

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
    if (!textContent || textContent.trim() === "") {
      return Response.json(
        {
          message: "متن پست نمی‌تواند خالی باشد!",
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
    const post = await postsModel.findOne({ _id: postId, isDeleted: false });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }
    // validate post author
    if (post.author.toString() !== currentUser._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به ویرایش این پست نیستید!",
        },
        { status: 403 },
      );
    }
    // update post
    const newPost = await postsModel.findOneAndUpdate(
      { _id: postId, isDeleted: false },
      {
        textContent: textContent.trim(),
      },
      { new: true },
    );
    if (!newPost) {
      return Response.json(
        {
          message: "ویرایش پست با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }
    return Response.json(
      { message: "پست با موفقیت ویرایش شد", post: newPost },
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

    const { postId } = await params;
   
    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = searchParams.get("limit");
    const sort = searchParams.get("sort");

    // check user is login
     const currentUser =await getCurrentUser()
   

    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    const result = await getPostInfo(postId, currentUser, cursor, limit,sort);

    return Response.json(
      {
        posts: result.posts,
        hasMore: result.hasMore,
        nextCursor: result.nextCursor,
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
