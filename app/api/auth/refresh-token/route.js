import connectToDB from "@/config/db";
import { generateToken } from "@/utils/auth";
import usersModel from "@/models/users";

import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth";
import refreshTokenModel from "@/models/refreshToken";

export const POST = async (req) => {
  try {
    await connectToDB();

    await refreshTokenModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    const token = (await cookies()).get("refreshToken");
    // validate token
    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    const validToken = verifyToken(token?.value);
    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // Check if refresh token exists in database
    const storedToken = await refreshTokenModel.findOne({
      identifier: validToken.email,
      token: token?.value,
      // expiresAt: { $gte: new Date() },
    });

    if (!storedToken) {
      return Response.json(
        { message: "Invalid refresh token" },
        { status: 403 },
      );
    }

    // Check if token is expired
    if (new Date() > new Date(storedToken.expiresAt)) {
      await refreshTokenModel.deleteOne({ token: token.value });
      return Response.json(
        { message: "Refresh token expired" },
        { status: 403 },
      );
    }

    // Verify user still exists
    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      await refreshTokenModel.deleteOne({ token: token.value });
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Generate new tokens
    const newAccessToken = generateToken({ email: user.email }, "1h");
    const newRefreshToken = generateToken({ email: user.email }, "7d");

    // Delete old refresh token and save new one
    await refreshTokenModel.deleteMany({
      identifier: validToken.email,
    });
    await refreshTokenModel.create({
      identifier: user.email,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set new cookies
    return Response.json(
      {
        // message: "ورود با موفقیت انجام شد",
        token: newAccessToken,
        refreshToken: newRefreshToken,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": [
            `token=${newAccessToken};HttpOnly;path=/;Max-Age=${60 * 60};`,
            `refreshToken=${newRefreshToken};HttpOnly;path=/;Max-Age=${
              7 * 24 * 60 * 60
            };`,
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
