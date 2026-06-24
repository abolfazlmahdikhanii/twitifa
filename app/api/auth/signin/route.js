import refreshTokenModel from "@/models/refreshToken";

const { default: connectToDB } = require("@/config/db");
const { default: Users } = require("@/models/users");
const { verifyPassword, generateToken } = require("@/utils/auth");
const userSigninSchema = require("@/validators/signin");

export const POST = async (req) => {
  try {
    await connectToDB();
    const body = await req.json();
    // check google SSO
    const isGoogleSSO = body.provider === "google";

    // Validate user input
    const signinValidator = userSigninSchema.safeParse(body);
    if (!signinValidator.success) {
      return Response.json(
        { errors: signinValidator.error.errors },
        { status: 422 }
      );
    }
    const { email, password, googleId, provider, identifier } =
      signinValidator.data;
    //check user existence
    let user = null;
    if (isGoogleSSO) {
      user = await Users.findOne({ $or: [{ email }, { googleId }] });
      if (!user) {
        return Response.json(
          { message: "کاربری با این اطلاعات یافت نشد" },
          { status: 404 }
        );
      }

      // check user signup SSO
      if (user.provider !== "google") {
        return Response.json(
          { message: "این حساب با ورود گوگل ثبت نشده است" },
          { status: 403 }
        );
      }
    } else {
      user = await Users.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return Response.json(
          { message: "کاربری با این اطلاعات یافت نشد" },
          { status: 404 }
        );
      }

      //   check signup method
      if (user.provider !== "credentials") {
        return Response.json(
          { message: "لطفا با گوگل وارد شوید" },
          { status: 403 }
        );
      }

      //   verify password
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return Response.json(
          {
            message: `${email ? "ایمیل" : "نام کاربری"} یا رمز عبور اشتباه است`,
          },
          { status: 403 }
        );
      }
    }
    // token generation and refresh token response

    const token = generateToken({ email: user.email }, "1h");
    const refreshToken = generateToken({ email: user.email }, "7d");

    // Save new refresh token to database
    await refreshTokenModel.create({
      identifier: user.email ? user.email : user.username,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return Response.json(
      {
        message: "ورود با موفقیت انجام شد",
        token,
        refreshToken,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${token};HttpOnly;path=/;Max-Age=${60 * 60};`,
            `refreshToken=${refreshToken};HttpOnly;path=/;Max-Age=${
              7 * 24 * 60 * 60
            };`,
          ],
        },
      }
    );
  } catch (error) {
    console.log("Signin Error:", error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 }
    );
  }
};
