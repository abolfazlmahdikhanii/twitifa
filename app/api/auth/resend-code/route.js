import connectToDB from "@/config/db";
import otp from "@/models/otp";
import { sendMail } from "@/services/mail-service";
import { generateOTP } from "@/utils/auth";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { email } = await req.json();

    if (!email) {
      return Response.json({ message: "ایمیل الزامی است" }, { status: 422 });
    }

    const record = await otp.findOne({ email });

    if (!record) {
      return Response.json(
        { message: "درخواست معتبری یافت نشد، دوباره ثبت‌نام کنید" },
        { status: 404 },
      );
    }

    const timeSinceLastSend = Date.now() - record.updatedAt.getTime();
    if (timeSinceLastSend < 60 * 1000) {
      const remainingSeconds = Math.ceil(
        (60 * 1000 - timeSinceLastSend) / 1000,
      );
      return Response.json(
        { message: `${remainingSeconds} ثانیه دیگر دوباره تلاش کنید` },
        { status: 429 },
      );
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    record.code = code;
    record.expiresAt = expiresAt;
    record.attempts = 0;
    await record.save();

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
      { message: "کد تایید جدید ارسال شد" },
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
