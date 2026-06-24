import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import postViews from "@/models/postViews";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { searchParams } = new URL(req.url);
    const lastCheckTime = searchParams.get("lastCheckTime");

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
    const cutoffTime = new Date(Date.now() - 60 * 60 * 1000);

    // get user post viewed
    const viewedPosts = await postViews
      .find({
        user: currentUser._id,
      })
      .select("post")
      .lean();
    const viewedPostIds = viewedPosts.map((vp) => vp.post.toString());

    // remove viewed post

    const newPostsQuery = {
      _id: { $nin: viewedPostIds },
      createdAt: { $gt: cutoffTime },
      author: { $ne: currentUser._id },
      isDeleted:false,
    };

    // get new post
    const newPosts = await postsModel
      .find(newPostsQuery)
      .populate("author", "username  _id avatar")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    
    const authorMap = new Map();
    let totalNewPostsCount = 0;
    const allNewPostIds = [];
    newPosts.forEach((post) => {
      if (!post.author) return;
      totalNewPostsCount++;
      allNewPostIds.push(post._id);
      const authorId = post.author._id.toString();
      if (!authorMap.has(authorId)) {
        authorMap.set(authorId, {
          author: {
            _id: post.author._id,
            username: post.author.username,
            profilePic: post.author.profilePic,
            name: post.author.name,
          },
          postCount: 1,
          latestPostTime: post.createdAt,
          latestPostId: post._id,
          postIds: [post._id],
        });
      } else {
        const existing = authorMap.get(authorId);
        existing.postCount += 1;
        existing.postIds.push(post._id);
        if (post.createdAt > existing.latestPostTime) {
          existing.latestPostTime = post.createdAt;
          existing.latestPostId = post._id;
        }
      }
    });

    const activeAuthors = Array.from(authorMap.values()).sort(
      (a, b) => b.latestPostTime - a.latestPostTime,
    );

    return Response.json(
      {
        activeAuthors,
        authorsCount: activeAuthors.length,
        totalNewPostsCount,
        newPostIds: allNewPostIds,
        timestamp: new Date(),
        hasUnviewedPosts: totalNewPostsCount > 0,
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
