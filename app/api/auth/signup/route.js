
import connectToDB from "@/config/db";
import otp from "@/models/otp";
import refreshTokenModel from "@/models/refreshToken";
import usersModel from "@/models/users";
import { sendMail } from "@/services/mail-service";
import { generateOTP, generateToken, hashPassword } from "@/utils/auth"; 
import userSignupSchema from "@/validators/signup";


export const POST = async (req) => {
  try {
    await connectToDB();
    const body = await req.json();

    const isGoogleSSO = body.provider === "google";

    if (isGoogleSSO) {
      return await handleGoogleSSO(body);
    }

    // Validate user input
    const signupValidator = userSignupSchema.safeParse(body);

    if (!signupValidator.success) {
      return Response.json(
        { errors: signupValidator.error.errors },
        { status: 422 }
      );
    }

    const { username, email, password } = signupValidator.data;

    // Check if user already exists
    const userExist = await usersModel.findOne({
      $or: [{ email }, { username }],
    });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 min

    if (userExist) {
      
      if (!userExist.emailVerified) {
    
        const hashedPassword = await hashPassword(password);
        
        await otp.findOneAndUpdate(
          { email },
          { 
            code, 
            expiresAt, 
            attempts: 0,
            userData: {
              username: userExist.username,
              email: userExist.email,
              password: hashedPassword, 
              role: userExist.role,
            }
          },
          { upsert: true, new: true }
        );

      
        const newMail = await sendMail({
          to: email,
          subject: "Your OTP Code",
          text: `Your OTP code is ${code}. It will expire in 3 minutes.`,
        });

        if (!newMail.success) {
          
          return Response.json(
            { message: "سرویس ایمیل موقتاً دچار اختلال است، لطفاً بعداً تلاش کنید" },
            { status: 500 }
          );
        }

        return Response.json(
          {
            message: "کد تایید جدید به ایمیل شما ارسال شد",
            email,
            needsVerification: true,
          },
          { status: 200 }
        );
      }

      
      return Response.json(
        { message: "کاربری با این ایمیل یا نام کاربری قبلا ثبت شده است" },
        { status: 409 }
      );
    }

 
    if (!password) {
      return Response.json(
        { message: "رمز عبور الزامی است" },
        { status: 422 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userCount = await usersModel.countDocuments();

    
    const userData = {
      username,
      email,
      password: hashedPassword,
      role: userCount === 0 ? "admin" : "user",
      emailVerified: false,
      accountType: "personal",
      provider: "credentials",
      organizationName: null,
    };

    await otp.deleteMany({ email });
    await otp.create({
      email,
      code,
      expiresAt,
      attempts: 0,
      userData, 
    });

   
    const newMail = await sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${code}. It will expire in 3 minutes.`,
    });

    if (!newMail.success) {
      console.log(`[DEV] OTP for ${email}: ${code}`);
      return Response.json(
        { message: "سرویس ایمیل موقتاً دچار اختلال است، لطفاً بعداً تلاش کنید" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "کد تایید به ایمیل شما ارسال شد",
        email,
        needsVerification: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 }
    );
  }
};


const handleGoogleSSO = async (body) => {
  const { email, googleId, username, picture } = body;

  let user = await usersModel.findOne({
    $or: [{ email }, { googleId }],
  });

  if (user) {
    const token = generateToken({ email: user.email }, "1h");
    const refreshToken = generateToken({ email: user.email }, "7d");

    await refreshTokenModel.create({
      identifier: user.email,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return Response.json(
      { message: "ورود با موفقیت انجام شد" },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${token};HttpOnly;path=/;Max-Age=${60 * 60};`,
            `refreshToken=${refreshToken};HttpOnly;path=/;Max-Age=${
              60 * 60 * 24 * 7
            }`,
          ],
        },
      }
    );
  }

  const userCount = await usersModel.countDocuments();
  const userData = {
    username,
    email,
    role: userCount === 0 ? "admin" : "user",
    emailVerified: true,
    accountType: "personal",
    provider: "google",
    googleId,
    avatar: picture || null,
    organizationName: null,
  };

  await usersModel.create(userData);

  const token = generateToken({ email }, "1h");
  const refreshToken = generateToken({ email }, "7d");

  await refreshTokenModel.create({
    identifier: email,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return Response.json(
    { message: "ثبت‌نام با موفقیت انجام شد" },
    {
      status: 201,
      headers: {
        "Set-Cookie": [
          `token=${token};HttpOnly;path=/;Max-Age=${60 * 60};`,
          `refreshToken=${refreshToken};HttpOnly;path=/;Max-Age=${
            60 * 60 * 24 * 7
          }`,
        ],
      },
    }
  );
};