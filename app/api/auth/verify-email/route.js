import connectToDB from "@/config/db";
import otp from "@/models/otp";
import refreshTokenModel from "@/models/refreshToken";
import usersModel from "@/models/users";
import { generateToken } from "@/utils/auth";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { email, code } = await req.json();

    if (!email || !code) {
      return Response.json(
        { message: "ایمیل و کد تایید الزامی است" },
        { status: 422 }
      );
    }

    const record = await otp.findOne({ email });

    if (!record) {
      return Response.json(
        { message: "کد تایید یافت نشد، دوباره ثبت‌نام کنید" },
        { status: 404 }
      );
    }

    if (record.expiresAt < new Date()) {
      await otp.deleteOne({ email });
      return Response.json(
        { message: "کد تایید منقضی شده، دوباره درخواست کنید" },
        { status: 410 }
      );
    }

    if (record.attempts >= 5) {
      await otp.deleteOne({ email });
      return Response.json(
        {
          message:
            "تعداد تلاش‌های ناموفق بیش از حد مجاز، دوباره ثبت‌نام کنید",
        },
        { status: 429 }
      );
    }

    if (record.code !== code) {
      record.attempts += 1;
      await record.save();

      return Response.json(
        {
          message: "کد تایید اشتباه است",
          remainingAttempts: 5 - record.attempts,
        },
        { status: 400 }
      );
    }

    const existingUser = await usersModel.findOne({ email });

    if (existingUser) {
      existingUser.emailVerified = true;
      if (record.userData?.password) {
        existingUser.password = record.userData.password;
      }
      await existingUser.save();
    } else {
      
      if (!record.userData) {
        await otp.deleteOne({ email });
        return Response.json(
          { message: "اطلاعات کاربر ناقص است، لطفا دوباره ثبت‌نام کنید" },
          { status: 500 }
        );
      }
      await usersModel.create({
        ...record.userData,
        emailVerified: true, 
      });
    }

  
    await otp.deleteOne({ email });

    // تولید توکن
    const token = generateToken({ email }, "1h");
    const refreshToken = generateToken({ email }, "7d");

    await refreshTokenModel.create({
      identifier: email,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

   
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = [
      "HttpOnly",
      `Path=/`,
      `Max-Age=${60 * 60}`,
      isProduction && "Secure",
      isProduction && "SameSite=Strict",
    ]
      .filter(Boolean)
      .join(";");

    const refreshCookieOptions = [
      "HttpOnly",
      `Path=/`,
      `Max-Age=${60 * 60 * 24 * 7}`,
      isProduction && "Secure",
      isProduction && "SameSite=Strict",
    ]
      .filter(Boolean)
      .join(";");

    return Response.json(
      { message: "ایمیل با موفقیت تایید شد", email },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${token};${cookieOptions}`,
            `refreshToken=${refreshToken};${refreshCookieOptions}`,
          ],
        },
      }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 }
    );
  }
};