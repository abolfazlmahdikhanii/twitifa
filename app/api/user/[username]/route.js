import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const GET = async (req, { params }) => {
  try {
    const token = (await cookies()).get("token");
    const { username } = await params;
    await connectToDB();

    let currentUser = null;
    // check exist token
    if (token.value) {
      // validate user
      const validToken = verifyToken(token?.value);
      if (!validToken) {
        Response.json({ message: "احراز هویت نامعتبر است" }, { status: 401 });
      }
      currentUser = await usersModel.findOne(
        { email: validToken.email },
        " -provider -password -emailVerified -updatedAt",
      );
    }

    // get user info by username
    const user = await usersModel
      .findOne({ username }, " -provider -password -emailVerified -updatedAt")

      .lean();

    if (!user) {
      return Response.json(
        { message: "چنین کاربری یافت نشد!" },
        { status: 404 },
      );
    }
    const posts = await postsModel
      .find({ author: user._id })
      .populate(
        "author",
        "-_id -provider -password -emailVerified -updatedAt -role",
      );
    const follower = await followModel.countDocuments({
      following: user._id,
    });
    const following = await followModel.countDocuments({
      follower: user._id,
    });
    return Response.json({
      user,
      posts,
      follower,
      following,
      isMe: user._id === currentUser?._id,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
