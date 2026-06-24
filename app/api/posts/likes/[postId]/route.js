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
    // check is liked
    const isLiked = await postLikesModel.findOneAndDelete(
      {
        postId,
        userId: currentUser._id,
      },
      { new: true },
    );
    if (!isLiked) {
      const newLike = await postLikesModel.create({
        postId,
        userId: currentUser._id,
      });
      if (!newLike) {
        return Response.json(
          {
            message: "خطا در لایک کردن پست اتفاق افتاده است!",
          },
          { status: 400 },
        );
      }

      if (currentUser._id.toString() !== post.author._id.toString()) {
        const existing = await notifyModel.findOne({
          recipientId: post.author._id,
          type: "like",
          isRead: false,
          entityId: post._id,
          entityType: "post",
        });
        if (existing) {
          await notifyModel.updateOne(
            {
              _id: existing._id,
              recipientId: post.author._id,
              type: "like",
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
              type: "like",
              actorIds: [currentUser._id],
              entityId: post._id,
              entityType: "post",
            });
          }
        }
      }
      return Response.json(
        {
          message: "پست با موفقیت لایک شد",
        },
        { status: 200 },
      );
    }
    const resLike = await notifyModel.findOneAndUpdate(
      {
        recipientId: post.author._id,
        type: "like",
        entityId: post._id,
        entityType: "post",
      },
      {
        $pull: { actorIds: currentUser._id },
      },
      { new: true },
    );

    if (resLike && resLike.actorIds?.length === 0) {
      await notifyModel.deleteOne({ _id: resLike._id });
    }

    await notifyModel.findOneAndUpdate(
      {
        recipientId: post.author._id,
        type: "like",
        entityId: post._id,
        entityType: "post",
      },
      {
        $pull: { actorIds: currentUser._id },
      },
    );
    return Response.json(
      {
        message: "پست با موفقیت لغو لایک شد",
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
    // count like
    const likeCount = await postLikesModel.countDocuments({
      postId,
      isDeleted: false,
    });
    // check is current user liked
    let isLiked = null;
    if (currentUser) {
      isLiked = await postLikesModel.findOne({
        postId,
        userId: currentUser._id,
      });
    }

    return Response.json(
      {
        likeCount,
        isLiked: !!isLiked,
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
