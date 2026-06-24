import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import hashtagModel from "@/models/hashtag";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { shuffle } from "lodash-es";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    // check user is login
    let currentUser = null;
    let followingIds = [];
    console.log(token);
    if (token?.value) {
      const validToken = verifyToken(token?.value);
      if (!validToken?.email) currentUser = null;
      currentUser = await usersModel
        .findOne(
          { email: validToken?.email },
          " -provider -password -emailVerified -updatedAt",
        )
        .lean();

      if (currentUser?._id) {
        const following = await followModel
          .find({ follower: currentUser?._id }, "following")
          .lean();
        followingIds = [
          ...following.map((f) => f.following.toString()),
          currentUser._id.toString(),
        ];
      }
    }

    // get trends
    const hashtags = await hashtagModel
      .find({ count: { $gt: 0 } }, "-__v  -updatedAt")
      .populate("posts", "isDeleted")
      .sort({ createdAt: -1 })
      .lean();

    const validHashtag = hashtags
      .map((h) => ({
        ...h,
        hashtagCount: h.posts.filter((post) => !post.isDeleted).length || 0,
      }))
      .filter((h) => h.hashtagCount > 0)
      .sort((a, b) => b.hashtagCount - a.hashtagCount)
      .slice(0, 6);

    //get all users
    const excludeIds = followingIds.length ? followingIds : [];
    const allUsers = await usersModel
      .find(
        {
          _id: { $nin: excludeIds },
          $or: [
            { firstName: { $ne: null } },
            { organizationName: { $ne: null } },
          ],
        },
        " username firstName lastName organizationName avatar bio accountType",
      )
      .limit(100)
      .lean();
    const shuffled = shuffle(allUsers);
    const suggestedUsers = shuffled.slice(0, 5);

    return Response.json(
      {
        trends: validHashtag,
        activeUsers: suggestedUsers,
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
