import connectToDB from "@/config/db";
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
    const body = await req.json();
    const { replyType } = body;

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
    if (!replyType) {
      return Response.json(
        {
          message: "گزینه ای را انتخاب کنید",
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
      { _id: postId,isDeleted:false  },
      {
        replySettings: replyType,
      },
      { new: true },
    );
    if (!newPost) {
      return Response.json(
        {
          message: "ویرایش افراد پاسخ دهنده با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }
    return Response.json(
      { message: "افراد پاسخ دهنده با موفقیت ویرایش شد", post: newPost },
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
    const post = await postsModel.findOne(
      { _id: postId, isDeleted: false },
      "replySettings",
    );
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }

    return Response.json({ replySetting: post ?? "all" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
