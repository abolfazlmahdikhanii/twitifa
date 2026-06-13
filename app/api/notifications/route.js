import connectToDB from "@/config/db";
import notifyModel from "@/models/notifications";
import usersModel from "@/models/users";
import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";

export const GET = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");
    const searchParams = req.nextUrl.searchParams;

    const filter = searchParams.get("filter");
    const limit = searchParams.get("limit");
    const cursor = searchParams.get("cursor");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate user

    const validToken = verifyToken(token?.value);

    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // get author info
    const currentUser = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!currentUser) {
      return Response.json(
        {
          message: "چنین کاربری با این ایمیل و نام کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }
    const limits = Number(limit) || 20;
    const filtersNotification = {
      recipientId: currentUser._id,
      actorIds: { $exists: true, $not: { $size: 0 } },
    };

    if (filter === "read") {
      filtersNotification.isRead = true;
    } else if (filter === "unread") {
      filtersNotification.isRead = false;
    }
    if (cursor) {
      filtersNotification._id = { $lt: cursor };
    }

    const notifications = await notifyModel
      .find(filtersNotification, "-__v")
      .populate(
        "actorIds",
        "accountType firstName lastName organizationName username avatar",
      )
      .limit(limits + 1)
      .sort({ _id: -1 })
      .lean();

    const hasMore = notifications.length > limits;
    if (hasMore) notifications.pop();

    const nextCursor = notifications.length
      ? notifications[notifications.length - 1]?._id
      : null;
    return Response.json(
      {
        notifications,
        nextCursor,
        hasMore,
      },
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
export const PUT = async (req) => {
  try {
    await connectToDB();
    const token = (await cookies()).get("token");

    if (!token || !token.value) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }

    // validate user

    const validToken = verifyToken(token?.value);

    if (!validToken) {
      return Response.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 },
      );
    }
    // get author info
    const currentUser = await usersModel.findOne(
      { email: validToken?.email },
      "_id",
    );
    if (!currentUser) {
      return Response.json(
        {
          message: "چنین کاربری با این ایمیل و نام کاربری وجود ندارد!",
        },
        { status: 404 },
      );
    }

    await notifyModel.updateMany(
      {
        recipientId: currentUser._id,
        isRead: false,
      },
      { $set: { isRead: true } },
    );

    return Response.json(
      {
        message: "تمام اعلان ها با موفقیت به عنوان خوانده شده علامت زده شد",
      },
      { status: 201 },
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "خطایی در سرور رخ داده است" },
      { status: 500 },
    );
  }
};
