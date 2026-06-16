import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import { getAuthorName } from "@/utils/post";

export const getUserReply = async (
  userInfo,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();
    const limits = Number(limit) || 10;

   
    const baseQuery = {
      author: userInfo._id,
      replyToPost: { $ne: null },
      isDeleted: false,
    };

    const parentIdsSet = new Set();
    let currentCursor = cursor;
    let lastProcessedReplyId = null;
    let safetyCounter = 0;

    while (parentIdsSet.size < limits + 1 && safetyCounter < 5) {
      const query = { ...baseQuery };
      if (currentCursor) {
        query._id = { $lt: currentCursor };
      }

      const replies = await postsModel
        .find(query)
        .select("replyToPost")
        .sort({ _id: -1 })
        .limit(50)
        .lean();

      if (replies.length === 0) break;

      replies.forEach((r) => {
        if (r.replyToPost) parentIdsSet.add(r.replyToPost.toString());
      });

      lastProcessedReplyId = replies[replies.length - 1]._id;
      currentCursor = lastProcessedReplyId;
      safetyCounter++;
    }

    const parentIdsArray = Array.from(parentIdsSet);
    const hasMore = parentIdsArray.length > limits;
    if (hasMore) parentIdsArray.pop();

    if (parentIdsArray.length === 0) {
      return { posts: [], hasMore: false, nextCursor: null };
    }

    const parentPosts = await postsModel
      .find({ _id: { $in: parentIdsArray }})
      .populate("author", "_id username email accountType organizationName firstName lastName")
      .populate("media", "-mediaId -userId")
      .populate("poll")
      .populate("replyToUser", "_id username firstName lastName email accountType organizationName")
      .populate([
        { path: "likesCount" },
        { path: "repostsCount" },
        { path: "ReplyCount" },
        { path: "viewCount" },
        { path: "postLikes", select: "userId" },
      ])
      .populate({
        path: "retweetedFrom",
        populate: [
          { path: "author", select: "username firstName lastName email accountType organizationName" },
          { path: "media", select: "-mediaId -userId" },
             {path:"poll"}
        ],
      })
      .sort({ _id: -1 })
      .lean({ virtuals: true });

    
    const userReplies = await postsModel
      .find({
        author: userInfo._id,
        replyToPost: { $in: parentIdsArray },
        isDeleted: false,
      })
      .populate("author", "_id username email accountType organizationName firstName lastName")
      .populate("media", "-mediaId -userId")
      .populate("poll")
      .populate("replyToUser", "_id username firstName lastName email accountType organizationName")
      .populate([
        { path: "likesCount" },
        { path: "repostsCount" },
        { path: "ReplyCount" },
        { path: "viewCount" },
        { path: "postLikes", select: "userId" },
      ])
      .populate({
        path: "retweetedFrom",
        populate: [
          { path: "author", select: "username firstName lastName email accountType organizationName" },
          { path: "media", select: "-mediaId -userId" },
        ],
      })
      .sort({ _id: -1 })
      .lean({ virtuals: true });

   
    const allPosts = [...parentPosts, ...userReplies];
    const postIds = allPosts.map((p) => p._id);
    
    const userReposts = currentUser
      ? await postsModel.find({
          author: currentUser._id,
          retweetedFrom: { $in: postIds },
          quoteContent: null,
          isDeleted: false,
        }).select("retweetedFrom").lean()
      : [];
    const userRepostSet = new Set(userReposts.map((r) => String(r.retweetedFrom)));

    const buildMeta = (post) => ({
      ...post,
      isLiked: currentUser ? post.postLikes?.some((like) => String(like.userId) === String(currentUser._id)) : false,
      isOwner: currentUser ? String(post.author._id) === String(currentUser._id) : false,
      isUserLogin: !!currentUser,
      postLikes: undefined,
      isUserReposted: currentUser && !post.retweetedFrom ? userRepostSet.has(String(post._id)) : false,
    });


    const repliesRes = parentPosts.map((parent) => {
      const myRepliesForParent = userReplies.filter(
        (r) => r.replyToPost && r.replyToPost.toString() === parent._id.toString()
      );

    
      let displayHeader = null;
      if (myRepliesForParent.length > 0) {
        displayHeader = currentUser && String(parent.author._id) === String(currentUser._id)
          ? "شما پاسخ دادید"
          : `${getAuthorName(parent.author)} پاسخ داد`;
      }

      return {
        ...buildMeta(parent),
        isParent: true, 
        replyHeader: displayHeader,
     
        directReplies: myRepliesForParent.map(reply => ({
          ...buildMeta(reply),
          replyToPost: { _id: parent._id, author: parent.author } 
        })),
      };
    });


    const nextCursor = lastProcessedReplyId ? String(lastProcessedReplyId) : null;

    return {
      posts: repliesRes,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[UserReplyService]", error);
    throw error;
  }
};