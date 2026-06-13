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

    const follower = await followModel
      .find({
        following: user._id,
      })
      .populate("follower")
      .lean();

    return Response.json(
      { message: "دریافت دنبال کنندگان با موفقیت انجام شد", follower:JSON.parse(JSON.stringify(follower)) },
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
