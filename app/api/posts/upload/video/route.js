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
  let videoFilePath = null;
  let posterFilePath = null;
  let postID = null;
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const formData = await req.formData();

    const video = formData.get("video");
    const poster = formData.get("poster");
    const duration = formData.get("duration");

    postID = formData.get("postID");
    console.log(video);
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
    if (!video) {
      return Response.json(
        {
          message: "ویدیویی اپلود نشده",
        },
        { status: 400 },
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      `public/media/videos/${user.username}`,
    );
    await fs.mkdir(uploadDir, { recursive: true });

    if (!video.type.startsWith("video/")) {
      return Response.json(
        {
          message: "نوع فایل اپلوو بایدی ویدیو باید باشد",
        },
        { status: 400 },
      );
    }
    if (video.size > 10 * 1024 * 1024) {
      return Response.json(
        {
          message: "حداکثر سایز ویدیو باید 10 مگابایت باشد",
        },
        { status: 400 },
      );
    }
    const buffer = Buffer.from(await video.arrayBuffer());
    const videoName = `${Date.now()}-${randomUUID()}-${video.name}`;

    videoFilePath = path.join(uploadDir, videoName);
    await fs.writeFile(videoFilePath, buffer);

    // save poster
    let posterUrl = null;
    let blurBase64 = null;
    if (poster) {
      if (!poster.type.startsWith("image/")) {
        await fs.unlink(videoFilePath);

        return Response.json(
          {
            message: "نوع فایل اپلودی عکس باید باشد",
          },
          { status: 400 },
        );
      }
      const posterBuffer = Buffer.from(await poster.arrayBuffer());
      const posterName = `poster-${Date.now()}-${randomUUID()}.webp`;
      posterFilePath = path.join(uploadDir, posterName);
      // await fs.writeFile(posterPath, posterBuffer);
      await sharp(posterBuffer)
        .webp({ quality: 85, effort: 4 })
        .toFile(posterFilePath);

      // make blur
      const blurBuffer = await sharp(posterBuffer)
        .resize(20, 20, { fit: "inside" })
        .jpeg({ quality: 20 })
        .toBuffer();
      blurBase64 = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
      posterUrl = `/media/videos/${user.username}/${posterName}`;
    }

    const media = await postMediaModel.create({
      url: `/media/videos/${user.username}/${videoName}`,
      mediaId: randomUUID(),
      mediaType: "video",
      userId: user._id,
      postId: postID,
      posterUrl,
      blurDataUrl: blurBase64,
      time: duration,
      size: video.size,
    });

    if (!media) throw new Error("خطا در اپلود");

    return Response.json(
      { message: "اپلود با موفقیت انجام شد" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    try {
      await postsModel.findOneAndDelete({ _id: postID });
      if (videoFilePath) {
        try {
          await fs.access(videoFilePath);
          await fs.unlink(videoFilePath);
        } catch {}
      }

      if (posterFilePath) {
        try {
          await fs.access(posterFilePath);
          await fs.unlink(posterFilePath);
        } catch {}
      }
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
