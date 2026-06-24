import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import usersModel from "@/models/users";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { username } = await params;

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

    const [follower, following] = await Promise.all([
      followModel.countDocuments({
        following: user._id,
      }),
      followModel.countDocuments({
        follower: user._id,
      }),
    ]);

    return Response.json(
      {
       
        followerCount: follower,
        followingCount: following,
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
