
import crypto from "crypto";
import connectToDB from "@/config/db";
import otp from "@/models/otp";
import usersModel from "@/models/users";
import resetTokenModel from "@/models/resetToken";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json(
        { message: "ایمیل و کد تایید الزامی است" },
        { status: 422 },
      );
    }

    const record = await otp.findOne({ email, purpose: "reset" });

    if (!record) {
      return Response.json({ message: "کد تایید یافت نشد" }, { status: 404 });
    }

    if (record.expiresAt < new Date()) {
      await otp.deleteOne({ email, purpose: "reset" });
      return Response.json(
        { message: "کد تایید منقضی شده است" },
        { status: 410 },
      );
    }

    if (record.attempts >= 5) {
      await otp.deleteOne({ email, purpose: "reset" });
      return Response.json(
        { message: "تعداد تلاش‌های ناموفق بیش از حد مجاز است" },
        { status: 429 },
      );
    }

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();
      return Response.json({ message: "کد تایید اشتباه است" }, { status: 400 });
    }

    const user = await usersModel.findOne({ email });
    if (!user) {
      return Response.json(
        { message: "کاربری با این ایمیل یافت نشد" },
        { status: 404 },
      );
    }

    const rawToken = crypto.randomUUID();
    
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

   
    await resetTokenModel.deleteMany({ userId: user._id });

    await resetTokenModel.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await otp.deleteOne({ email, purpose: "reset" });

    const response = NextResponse.json(
      { message: "کد تایید شد. لطفا رمز جدید را وارد کنید." },
      { status: 200 },
    );

    response.cookies.set("reset_session", rawToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
 
      maxAge: 10 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};