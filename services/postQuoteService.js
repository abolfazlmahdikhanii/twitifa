import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import { getAuthorName, getReplyHeader } from "@/utils/post";

export const getQuotes = async (
  postID,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();

    const limits = Number(limit) || 10;

    const query = {
      isDeleted: false,
      retweetedFrom: postID,
      quoteContent: { $ne: null },
    };

    let sortOption = { _id: -1 };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const quotes = await postsModel
      .find(query)
      .populate(
        "author",
        "_id username email accountType organizationName firstName lastName avatar",
      )
      .populate("media", "-mediaId -userId")
      .populate("poll")
      .populate("likesCount")
      .populate("postLikes", "userId")
      .populate("repostsCount")
      .populate("ReplyCount")
      .populate("viewCount")
      .populate({
        path: "retweetedFrom",
        populate: [
          {
            path: "author",
            select:
              "_id username firstName lastName email accountType organizationName avatar",
          },
          { path: "media", select: "-mediaId -userId" },
          { path: "poll" },
        ],
      })

      .sort(sortOption)
      .limit(limits + 1)
      .lean({ virtuals: true });

    const hasMore = quotes.length > limits;
    if (hasMore) quotes.pop();

    const allPostIds = [...quotes.map((p) => p._id)];

    const userReposts = currentUser
      ? await postsModel
          .find({
            author: currentUser._id,
            retweetedFrom: { $in: allPostIds },
            quoteContent: null,
            isDeleted: false,
          })
          .select("retweetedFrom")
          .lean()
      : [];

    const userRepostSet = new Set(
      userReposts.map((repost) => String(repost.retweetedFrom)),
    );

    const buildMeta = (postItem) => ({
      ...postItem,
      replyHeader:
        currentUser && currentUser?.username === postItem.author?.username
          ? "شما پاسخ دادید"
          : getAuthorName(postItem.author),
      repliedUser: postItem.replyToPost ? getReplyHeader(postItem) : null,
      isReposted: !!postItem.retweetedFrom && !postItem.quoteContent,
      isQuoteRepost: !!postItem.retweetedFrom && !!postItem.quoteContent,
      hasVote: currentUser
        ? (postItem.poll?.options?.some((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          ) ?? false)
        : false,
      isLiked: currentUser
        ? postItem.postLikes?.some(
            (like) => String(like.userId) === String(currentUser._id),
          )
        : false,
      isUserLogin: !!currentUser,
      isOwner: currentUser
        ? String(postItem.author._id) === String(currentUser._id)
        : false,
      totalVote: postItem.poll
        ? postItem.poll.options?.reduce((prev, curr) => prev + curr.votes, 0)
        : 0,
      isExpired: postItem.poll
        ? postItem.poll.duration <= new Date().getTime()
        : true,
      votedOption: currentUser
        ? postItem.poll?.options.find((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          )
        : false,
      isUserReposted:
        currentUser && !postItem.retweetedFrom
          ? userRepostSet.has(String(postItem._id))
          : false,
      postLikes: undefined,
    });

    const formattedQuotes = quotes.map(buildMeta);

    const nextCursor =
      formattedQuotes.length > 0
        ? String(formattedQuotes[formattedQuotes.length - 1]._id)
        : null;

    return {
      posts: formattedQuotes,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[PostInfoService]", error);
    throw error;
  }
};
