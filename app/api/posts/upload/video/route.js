// import connectToDB from "@/config/db";
// import usersModel from "@/models/users";
// import { verifyToken } from "@/utils/auth";
// import { cookies } from "next/headers";
// import path from "path";
// import fs from "fs/promises";
// import postMediaModel from "@/models/postMedia";
// import { isValidObjectId } from "mongoose";
// import postsModel from "@/models/posts";
// import { randomUUID } from "crypto";
// import sharp from "sharp";
// export const POST = async (req) => {
//   let videoFilePath = null;
//   let posterFilePath = null;
//   let postID = null;
//   try {
//     await connectToDB();
//     const token = (await cookies()).get("token");
//     const formData = await req.formData();

//     const video = formData.get("video");
//     const poster = formData.get("poster");
//     const duration = formData.get("duration");

//     postID = formData.get("postID");
//     console.log(video);
//     if (!token || !token.value) {
//       return Response.json(
//         { message: "احراز هویت نامعتبر است" },
//         { status: 401 },
//       );
//     }

//     // validate user

//     const validToken = verifyToken(token.value);

//     if (!validToken) {
//       return Response.json(
//         { message: "احراز هویت نامعتبر است" },
//         { status: 401 },
//       );
//     }
//     // get user info
//     const user = await usersModel.findOne(
//       { email: validToken?.email },
//       "_id username",
//     );
//     if (!user) {
//       return Response.json(
//         {
//           message: "چنین کاربری با این ایمیل و نام کاربری وجودندارد!",
//         },
//         { status: 404 },
//       );
//     }
//     if (!isValidObjectId(postID)) {
//       return Response.json(
//         {
//           message: "شناسه پست نامعتبر است!",
//         },
//         { status: 404 },
//       );
//     }
//     const existingPost = await postsModel.findOne({
//       _id: postID,
//       author: user._id,
//     });
//     if (!existingPost) {
//       return Response.json(
//         { message: "پست یافت نشد یا اجازه edit ندارید" },
//         { status: 404 },
//       );
//     }
//     // validate content
//     if (!video) {
//       return Response.json(
//         {
//           message: "ویدیویی اپلود نشده",
//         },
//         { status: 400 },
//       );
//     }

//     const uploadDir = path.join(
//       process.cwd(),
//       `public/media/videos/${user.username}`,
//     );
//     await fs.mkdir(uploadDir, { recursive: true });

//     if (!video.type.startsWith("video/")) {
//       return Response.json(
//         {
//           message: "نوع فایل اپلوو بایدی ویدیو باید باشد",
//         },
//         { status: 400 },
//       );
//     }
//     if (video.size > 10 * 1024 * 1024) {
//       return Response.json(
//         {
//           message: "حداکثر سایز ویدیو باید 10 مگابایت باشد",
//         },
//         { status: 400 },
//       );
//     }
//     const buffer = Buffer.from(await video.arrayBuffer());
//     const videoName = `${Date.now()}-${randomUUID()}-${video.name}`;

//     videoFilePath = path.join(uploadDir, videoName);
//     await fs.writeFile(videoFilePath, buffer);

//     // save poster
//     let posterUrl = null;
//     let blurBase64 = null;
//     if (poster) {
//       if (!poster.type.startsWith("image/")) {
//         await fs.unlink(videoFilePath);

//         return Response.json(
//           {
//             message: "نوع فایل اپلودی عکس باید باشد",
//           },
//           { status: 400 },
//         );
//       }
//       const posterBuffer = Buffer.from(await poster.arrayBuffer());
//       const posterName = `poster-${Date.now()}-${randomUUID()}.webp`;
//       posterFilePath = path.join(uploadDir, posterName);
//       // await fs.writeFile(posterPath, posterBuffer);
//       await sharp(posterBuffer)
//         .webp({ quality: 85, effort: 4 })
//         .toFile(posterFilePath);

//       // make blur
//       const blurBuffer = await sharp(posterBuffer)
//         .resize(20, 20, { fit: "inside" })
//         .jpeg({ quality: 20 })
//         .toBuffer();
//       blurBase64 = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;
//       posterUrl = `/media/videos/${user.username}/${posterName}`;
//     }

//     const media = await postMediaModel.create({
//       url: `/media/videos/${user.username}/${videoName}`,
//       mediaId: randomUUID(),
//       mediaType: "video",
//       userId: user._id,
//       postId: postID,
//       posterUrl,
//       blurDataUrl: blurBase64,
//       time: duration,
//       size: video.size,
//     });

//     if (!media) throw new Error("خطا در اپلود");

//     return Response.json(
//       { message: "اپلود با موفقیت انجام شد" },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.log(error);
//     try {
//       await postsModel.findOneAndDelete({ _id: postID });
//       if (videoFilePath) {
//         try {
//           await fs.access(videoFilePath);
//           await fs.unlink(videoFilePath);
//         } catch {}
//       }

//       if (posterFilePath) {
//         try {
//           await fs.access(posterFilePath);
//           await fs.unlink(posterFilePath);
//         } catch {}
//       }
//     } catch (cleanupErr) {
//       console.error("Cleanup error:", cleanupErr);
//     }
//     return Response.json(
//       { message: "خطایی در سرور رخ داده است" },
//       { status: 500 },
//     );
//   }
// };

/*------------------------ with image kit  ----------------------*/
import connectToDB from "@/config/db";
import postMediaModel from "@/models/postMedia";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import { deleteFile, uploadFileFromBuffer } from "@/services/fileService";
import { verifyToken } from "@/utils/auth";
import { isValidObjectId } from "mongoose";
import { cookies } from "next/headers";
import sharp from "sharp";
export const POST = async (req) => {
  let uploadedVideoId = null;
  let uploadedPosterId = null;
  let postID = null;

  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return Response.json({ message: "احراز هویت نامعتبر است" }, { status: 401 });
    }

    const validToken = verifyToken(token.value);
    if (!validToken) {
      return Response.json({ message: "احراز هویت نامعتبر است" }, { status: 401 });
    }

    const user = await usersModel.findOne({ email: validToken?.email }, "_id username");
    if (!user) {
      return Response.json({ message: "چنین کاربری وجود ندارد!" }, { status: 404 });
    }

    const formData = await req.formData();
    const video = formData.get("video");
    const poster = formData.get("poster");
    const duration = formData.get("duration");
    postID = formData.get("postID");

    if (!isValidObjectId(postID)) {
      return Response.json({ message: "شناسه پست نامعتبر است!" }, { status: 400 });
    }

    const existingPost = await postsModel.findOne({ _id: postID, author: user._id });
    if (!existingPost) {
      return Response.json({ message: "پست یافت نشد یا اجازه ویرایش ندارید" }, { status: 404 });
    }

    if (!video) {
      return Response.json({ message: "ویدیویی آپلود نشده" }, { status: 400 });
    }

    if (!video.type.startsWith("video/")) {
      return Response.json({ message: "فرمت فایل باید ویدیو باشد" }, { status: 400 });
    }

    if (video.size > 100 * 1024 * 1024) {
      return Response.json({ message: "حداکثر سایز ویدیو ۱۰۰ مگابایت است" }, { status: 400 });
    }

    const videoBuffer = Buffer.from(await video.arrayBuffer());
    const videoUpload = await uploadFileFromBuffer(
      videoBuffer,
      video.name,
      `social/${user.username}/videos`,
    );
    uploadedVideoId = videoUpload.fileId;

    // upload poster (optional)
    let posterUrl = null;
    let blurDataUrl = null;

    if (poster) {
      if (!poster.type.startsWith("image/")) {
        await deleteFile(uploadedVideoId);
        return Response.json({ message: "فرمت پوستر باید تصویر باشد" }, { status: 400 });
      }

      const posterBuffer = Buffer.from(await poster.arrayBuffer());

      // blur از پوستر
      const blurBuffer = await sharp(posterBuffer)
        .resize(20, 20, { fit: "inside" })
        .jpeg({ quality: 20 })
        .toBuffer();
      blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;

      const posterUpload = await uploadFileFromBuffer(
        posterBuffer,
        poster.name,
        `social/${user.username}/posters`,
      );
      uploadedPosterId = posterUpload.fileId;
      posterUrl = posterUpload.url;
    }

    const media = await postMediaModel.create({
      url: videoUpload.url,
      mediaId: videoUpload.fileId,
      mediaType: "video",
      userId: user._id,
      postId: postID,
      posterUrl,
      posterId: uploadedPosterId,
      blurDataUrl,
      time: duration,
      size: video.size,
    });

    if (!media) throw new Error("خطا در ذخیره مدیا");

    return Response.json({ message: "آپلود با موفقیت انجام شد" }, { status: 200 });

  } catch (error) {
    console.error(error);

    try {
      if (uploadedVideoId) await deleteFile(uploadedVideoId);
      if (uploadedPosterId) await deleteFile(uploadedPosterId);
      if (postID) await postsModel.findOneAndDelete({ _id: postID });
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }

    return Response.json({ message: "خطایی در سرور رخ داده است" }, { status: 500 });
  }
};
