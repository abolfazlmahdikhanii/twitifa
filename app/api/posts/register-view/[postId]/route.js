import connectToDB from "@/config/db";
import postViews from "@/models/postViews";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { getClientIp } from "request-ip";
import {
  generateDeviceFingerprint,
  generateSessionFingerprint,
} from "@/utils/post";
import { cookies } from "next/headers";
import postsModel from "@/models/posts";
import { isValidObjectId } from "mongoose";

export const POST = async (req, { params }) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const { postId } = await params;
    const body = await req.json();
    const { viewType } = body;
    // check user is login
    let currentUser = null;
    if (token && token.value) {
      const validToken = verifyToken(token?.value);
      if (!validToken) currentUser = null;
      currentUser = await usersModel
        .findOne(
          { email: validToken.email },
          " -provider -password -emailVerified -updatedAt",
        )
        .lean();
    }
    // validate postId
    if (!isValidObjectId(postId)) {
      return Response.json(
        {
          message: "شناسه پست نامعتبر است!",
        },
        { status: 404 },
      );
    }
    // valid post
    const post = await postsModel.findOne({ _id: postId ,isDeleted:false });
    if (!post) {
      return Response.json(
        {
          message: "چنین پستی وجود ندارد!",
        },
        { status: 404 },
      );
    }
    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const sessionFingerprint = generateSessionFingerprint({
      ip: ipAddress,
      ua: userAgent,
      cookies: (await cookies()).get("sessionHash")?.value || "",
    });

    const deviceFingerprint = generateDeviceFingerprint({
      ip: ipAddress,
      ua: userAgent,
      acceptLang: req.headers.get("accept-language") || "",
    });
    const existingView = await postViews
      .findOne({
        $or: [
          ...(currentUser
            ? [
                {
                  user: currentUser._id,
                  post: postId,
                },
              ]
            : []),

          {
            sessionId: sessionFingerprint,
            post: postId,
          },

          {
            deviceId: deviceFingerprint,
            post: postId,
          },
        ],
      })
      .lean();

    if (existingView) {
     
      return Response.json({
        success: true,
        message: "قبلاً مشاهده شده",
        exists: true,
      });
    }

    await postViews.create({
      user: currentUser?._id,
      sessionId: sessionFingerprint,
      deviceId: deviceFingerprint,
      post: postId,
      viewType: viewType || "impression",
      ipAddress: ipAddress,
      userAgent,
      fullyVisible: false,
      viewedAt: new Date(),
    });
    return Response.json({ message: "مشاهده شده است" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
