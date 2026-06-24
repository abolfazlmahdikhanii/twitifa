import connectToDB from "@/config/db";
import pollModel from "@/models/polls";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";

export const PUT = async (req, { params }) => {
  try {
    await connectToDB();
  
    const { postId } = await params;
    const body = await req.json();
    const { optionId } = body;
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
    console.log(author);
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

    // validate post author
    if (post.author.toString() === author._id.toString()) {
      return Response.json(
        {
          message: "شما مجاز به ثبت نظر در این پست نیستید!",
        },
        { status: 403 },
      );
    }
    const poll = await pollModel.findOne({ postId });

    // validate post is poll
    if (!poll) {
      return Response.json(
        {
          message: "این پست بدون نظرسنجی است!",
        },
        { status: 404 },
      );
    }
    // poll is expire or not
    if (poll && poll.duration <= Date.now()) {
      return Response.json(
        {
          message: "زمان این نطرسنجی به پایا رسیده",
        },
        { status: 403 },
      );
    }
    // check user vote or no
    if (
      poll.options.some((option) =>
        option.votedBy.some((id) => String(id) === String(author._id)),
      )
    ) {
      return Response.json(
        {
          message: "این کاربر قبلا رای داده است!",
        },
        { status: 402 },
      );
    }
    // valid option Id
    if (!isValidObjectId(optionId)) {
      return Response.json(
        {
          message: "شناسه گزینه نامعتبر است!",
        },
        { status: 400 },
      );
    }
    // set Vote
    const vote = await pollModel.findOneAndUpdate(
      { postId, "options._id": optionId  },
      {
        $inc: { "options.$.votes": 1 },
        $push: { "options.$.votedBy": author._id },
      },
      { new: true },
    );
    if (!vote) {
      return Response.json(
        { message: "گزینه‌ای با این شناسه وجود ندارد" },
        { status: 404 },
      );
    }

    return Response.json(
      { message: "رای شما ثبت شد", poll: vote },
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
