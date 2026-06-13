import connectToDB from "@/config/db";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import path from "path";
import fs from "fs/promises";
import postMediaModel from "@/models/postMedia";
import { isValidObjectId } from "mongoose";
import postsModel from "@/models/posts";
import { randomUUID } from "crypto";
import sharp from "sharp";
export const POST = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const formData = await req.formData();

    const images = formData.getAll("image");
    const postID = formData.get("postID");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate user

    const validToken = verifyToken(token.value);

    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // get user info
    const user = await usersModel.findOne(
      { email: validToken?.email },
      "_id username",
    );
    if (!user) {
      return Response.json(
        {
          message: "چنین کاربری با این ایمیل و نام کاربری وجودندارد!",
        },
        { status: 404 },
      );
    }
    if (!isValidObjectId(postID)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    const existingPost = await postsModel.findOne({
      _id: postID,
      author: user._id,
    });
    if (!existingPost) {
      return Response.json(
        { message: "پست یافت نشد یا اجازه edit ندارید" },
        { status: 404 },
      );
    }
    // validate content
    if (!images.length) {
      return Response.json(
        {
          message: "تصویری اپلود نشده",
        },
        { status: 400 },
      );
    }
    if (images.length > 4) {
      return Response.json(
        {
          message: "حداکثر تعداد تصاویر اپلودی 4 تصویر میباشد",
        },
        { status: 400 },
      );
    }
    const mediaIds = [];
    const uploadDir = path.join(
      process.cwd(),
      `public/media/images/${user.username}`,
    );
    await fs.mkdir(uploadDir, { recursive: true });
    for (const image of images) {
      try {
        if (!image.type.startsWith("image/")) {
          return Response.json(
            {
              message: "نوع فایل اپلودی عکس باید باشد",
            },
            { status: 400 },
          );
        }
        if (image.size > 5 * 1024 * 1024) {
          return Response.json(
            {
              message: "حداکثر سایز تصویر باید 5 مگابایت باشد",
            },
            { status: 400 },
          );
        }
        const buffer = Buffer.from(await image.arrayBuffer());
        const imageName = `img-${Date.now()}-${randomUUID()}.webp`;

        const fileDir = path.join(uploadDir, imageName);
        // await fs.writeFile(fileDir, buffer);//old way
        await sharp(buffer).webp({ quality: 85, effort: 4 }).toFile(fileDir);

        // make blur
        const blurBuffer = await sharp(buffer)
          .resize(20, 20, { fit: "inside" })
          .jpeg({ quality: 20 })
          .toBuffer();
        const blurBase64 = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;

        const media = await postMediaModel.create({
          url: `/media/images/${user.username}/${imageName}`,
          mediaId: randomUUID(),
          mediaType: "image",
          userId: user._id,
          postId: postID,
          blurDataUrl: blurBase64,
        });
        if (media) {
          mediaIds.push(media._id);
        }
      } catch (singleError) {
        console.error(`Image failed: ${image.name}`, singleError);
      }
    }

    if (mediaIds.length === 0) {
      await postsModel.findOneAndDelete({ _id: postID });
      return Response.json(
        { message: "هیچ تصویری اپلود نشد" },
        { status: 400 },
      );
    }

    return Response.json(
      { message: "اپلود با موفقیت انجام شد" },
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
