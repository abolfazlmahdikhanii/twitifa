import pollModel from "@/models/polls";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { addMinutes } from "date-fns";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

const { default: connectToDB } = require("@/config/db");

export const POST = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const body = await req.json();
    const { options, duration, postId } = body;

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
    const post = await postsModel.findOne({ _id: postId,isDeleted:false  });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }

    // validate poll author
    if (post.author.toString() !== author._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به ایجاد نظرسنجی برای این پست نیستید!",
        },
        { status: 403 },
      );
    }
    // validate polls
    if (!options || !Array.isArray(options) || options.length < 2) {
      return Response.json(
        {
          message: "حداقل 2 گزینه برای نظرسنجی الزامی است!",
        },
        { status: 400 },
      );
    }
    if (options.length > 4) {
      return Response.json(
        {
          message: "حداکثر 4 گزینه مجاز است!",
        },
        { status: 400 },
      );
    }
    // validate options
    const validOptions = options.filter(
      (item) => item.optionText && item.optionText.trim() !== "",
    );
    if (validOptions.length < 2) {
      return Response.json(
        {
          message: "حداقل 2 گزینه با متن معتبر الزامی است!",
        },
        { status: 400 },
      );
    }
    // validate duration
    if (!duration || typeof duration !== "number" || duration <= 0) {
      return Response.json(
        {
          message: "مدت زمان نظرسنجی نامعتبر است!",
        },
        { status: 400 },
      );
    }
    // check exiting poll
    const exitingPoll = await pollModel.findOne({ postId });
    if (exitingPoll) {
      return Response.json(
        {
          message: "برای این پست قبلاً نظرسنجی ایجاد شده است!",
        },
        { status: 409 },
      );
    }

    const expireAt = addMinutes(new Date(), duration);
    // create poll
    const poll = await pollModel.create({
      options: validOptions,
      duration: expireAt,
      postId,
    });
    if (!poll) {
      return Response.json(
        {
          message: "ایجاد نظرسنجی با خطا مواجه شد!",
        },
        { status: 400 },
      );
    }
    const updatedPost = await postsModel.findOneAndUpdate(
      {_id:postId,isDeleted:false },
      { poll: poll._id },
      { new: true }, 
    );

    if (!updatedPost) {
      
      await pollModel.findByIdAndDelete(poll._id);
      return Response.json(
        {
          message: "خطا در به‌روزرسانی پست!",
        },
        { status: 400 },
      );
    }
    return Response.json(
      { message: "نظرسنجی با موفقیت ایجاد شد" },
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
