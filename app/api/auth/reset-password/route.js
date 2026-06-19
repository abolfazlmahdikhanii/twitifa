// app/api/auth/set-password/route.js
import connectToDB from "@/config/db";
import refreshTokenModel from "@/models/refreshToken";
import resetTokenModel from "@/models/resetToken";
import usersModel from "@/models/users";
import { hashPassword } from "@/utils/auth";
import crypto from "crypto";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectToDB();

    const { password } = await req.json();

    if (!password) {
      return Response.json({ message: "رمز عبور الزامی است" }, { status: 422 });
    }

    const rawToken = req.cookies.get("reset_session")?.value;

    if (!rawToken) {
      return Response.json(
        { message: "جلسه ریست پسورد منقضی شده است. لطفا دوباره تلاش کنید." },
        { status: 401 },
      );
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const tokenRecord = await resetTokenModel.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return Response.json(
        { message: "لینک تغییر رمز نامعتبر است یا منقضی شده." },
        { status: 401 },
      );
    }

    const user = await usersModel.findById(tokenRecord.userId);
    if (!user) {
      return Response.json(
        { message: "کاربری با این ایمیل یافت نشد" },
        { status: 404 },
      );
    }

    user.password = await hashPassword(password);
    await user.save();

    await resetTokenModel.deleteOne({ _id: tokenRecord._id });

    await refreshTokenModel.deleteMany({ identifier: user.email });

    const response = NextResponse.json(
      { message: "رمز عبور با موفقیت تغییر کرد" },
      { status: 200 },
    );
    response.cookies.delete("reset_session");

    return response;
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
