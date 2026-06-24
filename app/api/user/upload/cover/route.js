import connectToDB from "@/config/db";

import usersModel from "@/models/users";
import { deleteFile, uploadFileFromBuffer } from "@/services/fileService";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const POST = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    const validToken = verifyToken(token.value);
    if (!validToken) {
      return Response.json({ message: "توکن نامعتبر است" }, { status: 401 });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return Response.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return Response.json({ message: "تصویری آپلود نشده" }, { status: 400 });
    }

    if (!image.type.startsWith("image/")) {
      return Response.json(
        { message: "فرمت فایل باید تصویر باشد" },
        { status: 400 },
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return Response.json(
        { message: "حداکثر سایز تصویر 5 مگابایت است" },
        { status: 400 },
      );
    }

    // delete old profile image if exists
    if (user.imgId) {
      try {
        await deleteFile(user.imgId);
      } catch (e) {
        console.warn("Could not delete old cover image:", e.message);
      }
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadResult = await uploadFileFromBuffer(
      buffer,
      image.name,
      `cover/${user.username}`,
    );

    await usersModel.findByIdAndUpdate(user._id, {
      profileBg: uploadResult.url,
      profileBgId: uploadResult.fileId,
    });

    return Response.json(
      {
        success: true,
        url: uploadResult.url,
        fid: uploadResult.fileId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    const validToken = verifyToken(token.value);
    if (!validToken) {
      return Response.json({ message: "توکن نامعتبر است" }, { status: 401 });
    }

    const user = await usersModel.findOne({ email: validToken.email });
    if (!user) {
      return Response.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    if (!user.imgId) {
      return Response.json(
        { message: "تصویر پروفایلی وجود ندارد" },
        { status: 400 },
      );
    }

    await deleteFile(user.profileBgId);

    await usersModel.findByIdAndUpdate(user._id, {
      profileBg: "",
      profileBgId: "",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
