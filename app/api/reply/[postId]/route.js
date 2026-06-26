import connectToDB from "@/config/db";
import notifyModel from "@/models/notifications";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { getCurrentUser } from "@/services/authService";
import { verifyToken } from "@/utils/auth";
import { getReplyHeader } from "@/utils/post";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params;
    const body = await req.json();
    const { replyContent } = body;

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
    if (replyContent.trim() === "") {
      return Response.json(
        {
          message: "پاسخ خالی است!",
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
    // update post
    const newPost = await postsModel.create({
      replyToPost: postId,
      textContent: replyContent.trim(),
      author: currentUser._id,
    });
    if (!newPost) {
      return Response.json(
        {
          message: "پاسخ پست با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }

    // check if self not save notification
   if(currentUser._id.toString()!==post.author._id.toString()){
     const existing = await notifyModel.findOne({
      recipientId: post.author._id,
      type: "reply",
      isRead: false,
      entityId: post._id,
      entityType: "post",
    });
    if (existing) {
      await notifyModel.updateOne(
        {
          _id: existing._id,
          recipientId: post.author._id,
          type: "reply",
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
          type: "reply",
          actorIds: [currentUser._id],
          entityId: post._id,
          entityType: "post",
        });
      }
    }
   }

    return Response.json(
      { message: "پاسخ پست با موفقیت انجام شد" },
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
     const currentUser =await getCurrentUser()
   
    const replyCount = await postsModel.countDocuments({
      replyToPost: postId,
      retweetedFrom: null,
    });
    const posts = await postsModel
      .find({ replyToPost: postId, retweetedFrom: null })
      .populate(
        "author",
        "username email accountType organizationName firstName lastName",
      )
      .populate("media", "-mediaId -userId")
      .populate("poll")
      .populate(
        "replyToUser",
        "_id username firstName lastName email accountType organizationName",
      )
      .populate([
        { path: "likesCount", count: true },
        { path: "repostsCount", count: true },
        { path: "ReplyCount", count: true },
        { path: "viewCount", count: true },
        { path: "postLikes", select: "userId" },
      ])
      .populate("directReplies", "textContent author createdAt")
      .populate({
        path: "directReplies",
        populate: [
          {
            path: "author",
            select: "username firstName lastName accountType organizationName",
          },
          { path: "directReplies" },
        ],
      })
      .populate({
        path: "retweetedFrom",
        populate: [
          {
            path: "author",
            select:
              "username firstName lastName email accountType organizationName",
          },
          { path: "media", select: "-mediaId -userId " },
        ],
      })
      .populate({
        path: "replyToPost",
        populate: [
          {
            path: "author",
            select:
              "_id username firstName lastName email accountType organizationName",
          },
          { path: "media", select: "-mediaId -userId " },
        ],
      })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    const postIds = posts.map((p) => p._id);
    const userReposts = currentUser
      ? await postsModel
          .find({
            author: currentUser._id,
            retweetedFrom: { $in: postIds },
            quoteContent: null,
             isDeleted:false
          })
          .select("retweetedFrom")
          .lean()
      : [];

    const postsRes = posts.map((post) => ({
      ...post,
      repliedUser: post.replyToPost ? getReplyHeader(post) : null,
      parentPost: post.replyToPost,
      replyLevel: post.replyLevel,
      isReposted: !!post.retweetedFrom && !post.quoteContent,
      isQuoteRepost: !!post.retweetedFrom && !!post.quoteContent,
      hasVote: currentUser
        ? (post.poll?.options?.some((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          ) ?? false)
        : false,
      isLiked: currentUser
        ? post.postLikes.some(
            (like) => String(like.userId) === String(currentUser._id),
          )
        : false,
      isUserLogin: !!currentUser,
      isOwner: currentUser
        ? String(post.author._id) === String(currentUser._id)
        : false,

      totalVote: post.poll
        ? post.poll.options?.reduce((prev, curr) => prev + curr.votes, 0)
        : 0,
      isExpired: post.poll ? post.poll.duration <= new Date().getTime() : true,
      votedOption: currentUser
        ? post.poll?.options.find((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          )
        : false,
      postLikes: undefined,
    }));

    return Response.json(
      { postsReply: JSON.parse(JSON.stringify(postsRes)), replyCount },
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
