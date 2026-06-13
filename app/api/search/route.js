import connectToDB from "@/config/db";
import usersModel from "@/models/users";

const escapeRegex = (str) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const GET = async (req) => {
  try {
    await connectToDB();
    const searchParams = req.nextUrl.searchParams;
    const search = searchParams.get("q");
    if (!search || search.trim().length < 2) {
      return Response.json({ result: [] }, { status: 200 });
    }

    const safeSearch = escapeRegex(search.trim());
    const users = await usersModel
      .find({
        $or: [
          { username: { $regex: safeSearch, $options: "i" } },
          { organizationName: { $regex: safeSearch, $options: "i" } },
          { firstName: { $regex: safeSearch, $options: "i" } },
          { lastName: { $regex: safeSearch, $options: "i" } },
        ],
      })

      .select("username firstName lastName avatar organizationName accountType")
      .limit(10)
      .lean();

    return Response.json({ result: users }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
