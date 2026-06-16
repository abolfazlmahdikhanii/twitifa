import connectToDB from "@/config/db";
import postsModel from "@/models/posts";

export const getUserRePosts = async (
  userInfo,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();
    const limits = Number(limit) || 10;

    const query = {
      author: userInfo._id,
      retweetedFrom: { $ne: null },
      replyToPost: null,
      isDeleted: false,
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const postsRes = await postsModel
      .find(query)
      .populate(
        "author",
        "_id username email accountType organizationName firstName lastName",
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
              "_id username firstName lastName email accountType organizationName",
          },
          { path: "media", select: "-mediaId -userId" },
          { path: "likesCount" },
          { path: "repostsCount" },
          { path: "ReplyCount" },
          { path: "viewCount" },
          { path: "postLikes", select: "userId" },
          { path: "poll" },
        ],
      })
      .limit(limits + 1)
      .sort({ _id: -1 })
      .lean({ virtuals: true });

    const hasMore = postsRes.length > limits;
    if (hasMore) postsRes.pop();
    const originalPostIds = postsRes
      .map((p) => p.retweetedFrom?._id)
      .filter(Boolean);

    const userReposts = currentUser
      ? await postsModel
          .find({
            author: currentUser._id,
            retweetedFrom: { $in: originalPostIds },
            quoteContent: null,
            isDeleted: false,
          })
          .select("retweetedFrom")
          .lean()
      : [];

    const userRepostSet = new Set(
      userReposts.map((repost) => String(repost.retweetedFrom)),
    );

    const posts = postsRes.map((post) => {
      const originalPost = post.retweetedFrom;

      return {
        ...post,
        isReposted: !post.quoteContent,
        isQuoteRepost: !!post.quoteContent,
        isLiked: currentUser
          ? originalPost?.postLikes?.some(
              (like) => String(like.userId) === String(currentUser._id),
            )
          : false,

        isUserReposted: currentUser
          ? userRepostSet.has(String(originalPost?._id))
          : false,

        hasVote: currentUser
          ? (originalPost?.poll?.options?.some((option) =>
              option.votedBy?.some(
                (id) => String(id) === String(currentUser._id),
              ),
            ) ?? false)
          : false,

        isUserLogin: !!currentUser,
        isOwner: currentUser
          ? String(post.author._id) === String(currentUser._id)
          : false,

        totalVote: originalPost?.poll
          ? originalPost.poll.options?.reduce(
              (prev, curr) => prev + curr.votes,
              0,
            )
          : 0,

        isExpired: originalPost?.poll
          ? originalPost.poll.duration <= new Date().getTime()
          : true,

        votedOption: currentUser
          ? originalPost?.poll?.options.find((option) =>
              option.votedBy?.some(
                (id) => String(id) === String(currentUser._id),
              ),
            )?._id || null
          : null,

        postLikes: undefined,
      };
    });

    const nextCursor =
      posts.length > 0 ? String(posts[posts.length - 1]._id) : null;

    return {
      posts: posts,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[UserRePostsService]", error);
    throw error;
  }
};
