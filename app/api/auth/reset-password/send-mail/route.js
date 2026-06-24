import connectToDB from "@/config/db";
import otp from "@/models/otp";
import usersModel from "@/models/users";
import { sendMail } from "@/services/mail-service";
import { generateOTP } from "@/utils/auth";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: "ایمیل الزامی است" }, { status: 422 });
    }

    const user = await usersModel.findOne({ email });

    if (!user) {
      return Response.json(
        { message: "اگر ثبت نام کرده باشید.ایمیل به شما ارسال خواهد شد" },
        { status: 200 },
      );
    }

    const code = generateOTP();

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await otp.findOneAndUpdate(
      { email, purpose: "reset" },
      {
        code,
        expiresAt,
        attempts: 0,
      },
      { upsert: true, new: true },
    );
    const newMail = await sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${code}. It will expire in 3 minutes.`,
    });

    if (!newMail.success) {
      return Response.json(
        {
          message: "سرویس ایمیل موقتاً دچار اختلال است، لطفاً بعداً تلاش کنید",
        },
        { status: 500 },
      );
    }
    return Response.json(
      { message: "کد تایید به ایمیل شما ارسال شد" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Forgot Password Error:", error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
