import connectToDB from "@/config/db";
import postMediaModel from "@/models/postMedia";
import mongoose from "mongoose";

export const getMedia = async (currentUser,cursor = null, limit = 10, filter = "video") => {
  try {
    await connectToDB();

    const limits = Number(limit) || 10;

    const query = {
      mediaType: filter === "image" ? "image" : "video",
    };


    if (cursor) {
      query._id = { $lt: cursor };
    }

    const medias = await postMediaModel
      .find(query)
      .populate(
        "userId",
        "_id username firstName lastName avatar accountType organizationName",
      )
      .populate("postId", "_id isDeleted replyToPost")
      .sort({ _id: -1 })
      .limit(limits + 1)
      .lean();

    const filtered = medias.filter(
      (m) => m.postId && !m.postId.isDeleted && !m.postId.replyToPost,
    );

    const hasMore = filtered.length > limits;
    if (hasMore) filtered.pop();

    const posts = filtered.map((m) => ({
      _id: m._id,
      postId: m.postId._id,
      author: m.userId,
      media: {
        url: m.url,
        mediaType: m.mediaType,
        posterUrl: m.posterUrl,
        time: m.time,
        size: m.size,
        blurDataUrl: m.blurDataUrl,
      },
    }));

    return {
      posts,
      hasMore,
      nextCursor: posts.length > 0 ? String(posts.at(-1)._id) : null,
    };
  } catch (error) {
    console.error("[MediaFeedError]", error);
    throw error;
  }
};
