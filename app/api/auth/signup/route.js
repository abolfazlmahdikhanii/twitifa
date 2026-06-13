import refreshTokenModel from "@/models/refreshToken";
import usersModel from "@/models/users";

const { default: connectToDB } = require("@/config/db");

const { hashPassword, generateToken } = require("@/utils/auth");
const { default: userSignupSchema } = require("@/validators/signup");

export const POST = async (req) => {
  try {
    await connectToDB();
    const body = await req.json();

    const isGoogleSSO = body.provider === "google";

    // Validate user input
    const signupValidator = userSignupSchema.safeParse(body);

    if (!signupValidator.success) {
      return Response.json(
        { errors: signupValidator.error.errors },
        { status: 422 },
      );
    }
    const { username, email, password, provider, googleId, picture } =
      signupValidator.data;
    // Check if user already exists
    const findQuery = isGoogleSSO
      ? { $or: [{ email }, { googleId }] }
      : { $or: [{ email }, { username }] };
    const userExist = await usersModel.findOne(findQuery);
    if (userExist) {
      return Response.json(
        {
          message: "کاربری با این ایمیل یا نام کاربری قبلا ثبت شده است",
        },
        { status: 409 },
      );
    }
    // prepare data
    const userCount = await usersModel.countDocuments();
    const userData = {
      username,
      email,
      role: userCount === 0 ? "admin" : "user",
      emailVerified: isGoogleSSO,
      accountType: "personal",
      provider: isGoogleSSO ? "google" : "credentials",
      organizationName: null,
    };
    if (!isGoogleSSO) {
      if (!password) {
        return Response.json(
          { message: "رمز عبور الزامی است" },
          { status: 422 },
        );
      }
      const hashedPassword = await hashPassword(password);
      userData.password = hashedPassword;
    } else {
      userData.googleId = googleId;
      if (picture) userData.avatar = picture;
    }
    // Create new user

    await usersModel.create(userData);

    // generate token and refresh token
    const token = generateToken({ email }, "1h");
    const refreshToken = generateToken({ email }, "7d");
    // Save new refresh token to database
    await refreshTokenModel.create({
      identifier: email ? email : username,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    // Return success response
    return Response.json(
      { message: "ثبت نام با موفقیت انجام شد" },
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
      },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
