import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import userProfileSchema from "@/validators/profile";
import { cookies } from "next/headers";

export const PUT = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const body = await req.json();

    // check if user is authenticated
    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    const validateToken = verifyToken(token.value);
    if (!validateToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate data
    const profileValidate = userProfileSchema.safeParse(body);
    if (!profileValidate.success) {
      return Response.json(
        { errors: profileValidate.error.errors },
        { status: 422 },
      );
    }

    const profiles = Object.fromEntries(
      Object.entries(profileValidate.data).filter(([_, value]) => value),
    );

    // update user info
    const updateUser = await usersModel.findOneAndUpdate(
      { email: validateToken.email },
      { $set: profiles },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updateUser) {
      return Response.json(
        { message: "چنین کاربری یافت نشد!" },
        { status: 404 },
      );
    }
    return Response.json(
      { message: "پروفایل با موفقیت بروزرسانی شد" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
