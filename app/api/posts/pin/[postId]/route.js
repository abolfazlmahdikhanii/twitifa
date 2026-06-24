import connectToDB from "@/config/db";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const PUT = async (req, { params }) => {
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
    const post = await postsModel.findOne({ _id: postId,isDeleted:false  });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }
    // check post author
    if (post.author.toString() !== currentUser._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به سنجاق کردن این پست نیستید!",
        },
        { status: 403 },
      );
    }
    // check is pin
    const isPin = await postsModel.findOneAndUpdate(
      { _id: postId, author: currentUser._id,isDeleted:false  },
      { isPin: !post.isPin },
      { new: true },
    );
    if (!isPin) {
      return Response.json(
        {
          message: "سنجاق پست با خطا مواجه شد",
        },
        { status: 400 },
      );
    }
    return Response.json(
      {
        message: `پست با موفقیت ${!isPin.isPin ? "لغو" : ""} سنجاق شد`,
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
    const post = await postsModel.findOne({ _id: postId ,isDeleted:false });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }

    // check is pin
    const isPin = await postsModel.findOne({
      _id: postId,
      author: currentUser._id,
      isPin: true,
      isDeleted:false 
    });

    return Response.json(
      {
        isPin: !!isPin,
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
