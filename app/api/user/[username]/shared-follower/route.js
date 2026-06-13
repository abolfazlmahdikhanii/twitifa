import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

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
    const user = await usersModel.findOne({ username }, "_id");
    if (!user) {
      return Response.json(
        {
          message: "چنین کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }

    const currentFollowers = await followModel
      .distinct("following", {
        follower: currentUser._id,
      })
      .lean();
    const mutualFollowers = await followModel
      .distinct("follower", {
        following: user._id,
        follower: {
          $in: currentFollowers,
          // $ne: currentUser._id,
        },
      })
      .lean();

    //  Follower details
    const sharedFollowers = await usersModel
      .find(
        { _id: { $in: mutualFollowers } },
        "username firstName lastName avatar organizationName",
      )
      .lean();

    return Response.json(
      {
        sharedFollower: JSON.parse(JSON.stringify(sharedFollowers)),
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
