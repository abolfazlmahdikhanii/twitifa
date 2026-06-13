
import connectToDB from "@/config/db";
import { verifyToken } from "@/utils/auth";
import usersModel from "@/models/users";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    // check if user is authenticated
    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    const validateToken = verifyToken(token.value);
    if (!validateToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    const user = await usersModel.findOne(
      { email: validateToken.email },
      " -provider -password -emailVerified -updatedAt",
    );
    if (!user) {
      return Response.json({ message: "کاربر یافت نشد!" }, { status: 404 });
    }

    return Response.json({ user }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
