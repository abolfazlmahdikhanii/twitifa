import connectToDB from "@/config/db";

import followModel from "@/models/follows";
import notifyModel from "@/models/notifications";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { username } = await params;
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
    // get current user info
    const currentUser = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!currentUser) {
      return Response.json(
        {
          message: "چنین کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }
    // get author info
    const targetUser = await usersModel.findOne({ username }, "_id");
    if (!targetUser) {
      return Response.json(
        {
          message: "چنین کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }
    if (currentUser._id.toString() === targetUser._id.toString()) {
      return Response.json(
        { message: "کاربر نمیتوتند خودش را دنبال کند" },
        { status: 400 },
      );
    }

    const existFollow = await followModel.findOne({
      follower: currentUser._id,
      following: targetUser._id,
    });

    if (!existFollow) {
      const newFollow = await followModel.create({
        follower: currentUser._id,
        following: targetUser._id,
      });
      if (!newFollow) {
        return Response.json(
          { message: "دنبال کردن کاربر با مشکل مواجه شد" },
          { status: 400 },
        );
      }

      const existing = await notifyModel.findOne({
        recipientId: targetUser._id,
        type: "follow",
        isRead: false,
        createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
      });
      if (existing) {
        await notifyModel.updateOne(
          { _id: existing._id },
          {
            $addToSet: { actorIds: currentUser._id },
          },
        );
      } else {
        await notifyModel.create({
          recipientId: targetUser._id,
          type: "follow",
          actorIds: [currentUser._id],
        });
      }
      return Response.json(
        { message: "دنبال کردن کاربر با موفقیت انجام شد" },
        { status: 200 },
      );
    } else {
      const unFollow = await followModel.deleteOne({
        _id: existFollow._id,
      });

      if (!unFollow.deletedCount) {
        return Response.json(
          { message: "لغو دنبال کردن کاربر با مشکل مواجه شد" },
          { status: 400 },
        );
      }
      return Response.json(
        { message: "لغو دنبال کردن کاربر با موفقیت انجام شد" },
        { status: 200 },
      );
    }
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
    const { username } = await params;
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
    // get current user info
    const currentUser = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!currentUser) {
      return Response.json(
        {
          message: "چنین کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }
    // get author info
    const targetUser = await usersModel.findOne({ username }, "_id");
    if (!targetUser) {
      return Response.json(
        {
          message: "چنین کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }

    const [follow, isFollowMe] = await Promise.all([
      followModel.findOne({
        follower: currentUser._id,
        following: targetUser._id,
      }),
      followModel.findOne({
        following: currentUser._id,
        follower: targetUser._id,
      }),
    ]);

    return Response.json(
      {
        isFollow: !!follow,
        isFollowMe: !!isFollowMe,
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
