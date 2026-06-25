import refreshTokenModel from "@/models/refreshToken";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (refreshToken) {
      await refreshTokenModel.deleteOne({ token: refreshToken });
    }

    const clearCookie = (name) =>
      `${name}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict`;

    return Response.json(
      { message: "خروج با موفقیت انجام شد" },
      {
        status: 200,
        headers: {
          "Set-Cookie": [clearCookie("token"), clearCookie("refreshToken")],
        },
      },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};