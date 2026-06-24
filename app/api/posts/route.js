import hashtagModel from "@/models/hashtag";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getFeed } from "@/services/feedService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

const { default: connectToDB } = require("@/config/db");

export const POST = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const body = await req.json();
    const { textContent, replyType } = body;

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
    // validate content
    if (!textContent || textContent.trim() === "") {
      return Response.json(
        {
          message: "متن پست نمی‌تواند خالی باشد!",
        },
        { status: 400 },
      );
    }
    // create post
    const post = await postsModel.create({
      textContent: textContent.trim(),
      author: author._id,
      replySettings: replyType,
    });
    if (!post) {
      return Response.json(
        {
          message: "ایجاد پست با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }
    const hashtags = textContent.match(/#[\w\u0600-\u06FF]+/gi) || [];
    for (const hashtag of hashtags) {
      await hashtagModel.findOneAndUpdate(
        { hashtag },
        {
          $inc: { count: 1 },
          $push: { posts: post._id },
          name: hashtag.replace("#", ""),
        },
        { upsert: true },
      );
    }
    return Response.json(
      { message: "پست با موفقیت ایجاد شد", post },
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
export const GET = async (req) => {
  try {
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
    const urlSearchParams = req.nextUrl.searchParams;
    const cursor = urlSearchParams.get("cursor");
    const tab = urlSearchParams.get("tab");
    const limit = urlSearchParams.get("limit");
    let isFollowing = false;
    if (tab === "following") isFollowing = true;

    const posts = await getFeed(currentUser, cursor, limit, isFollowing);

    return Response.json(
      {
        posts: posts.posts,
        hasMore: posts.hasMore,
        nextCursor: posts.nextCursor,
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
