
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

    const following = await followModel
      .find({
        follower: user._id,
      })
      .populate("following")
      .lean();

    return Response.json(
      {
        message: "دریافت دنبال شوندگان با موفقیت انجام شد",
        following: JSON.parse(JSON.stringify(following)),
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
