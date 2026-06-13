import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import userProfileSchema from "@/validators/profile";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const body = await req.json();
    // validate token
    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 }
      );
    }
    const validToken = verifyToken(token.value);
    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 }
      );
    }
    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return Response.json(
        { message: "چنین کاربری یافت نشد!" },
        { status: 404 }
      );
    }
    // validate data
    const profileValidate = userProfileSchema.safeParse(body);
    if (!profileValidate.success) {
      return Response.json(
        { errors: profileValidate.error.errors },
        { status: 422 }
      );
    }
    // update profile
    const { accountType, firstName, lastName, organizationName } =
      profileValidate.data;
    const info = {
      accountType,
    };
    if (firstName && lastName) {
      info.firstName = firstName;
      info.lastName = lastName;
    }
    if (organizationName) {
      info.organizationName = organizationName;
    }

    const completeProfile = await usersModel.findOneAndUpdate(
      { _id: user._id },
      info
    );
    if (!completeProfile) {
      return Response.json({ message: "خطا در ثبت اطلاعات" }, { status: 400 });
    }
    return Response.json(
      { message: "ثبت اطلاعات با موفقیت انجام شد" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 }
    );
  }
};
