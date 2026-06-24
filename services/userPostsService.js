import connectToDB from "@/config/db";
import postsModel from "@/models/posts";

export const getUserPosts = async (
  userInfo,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();
    const query = {
      author: userInfo._id,
      retweetedFrom: null,
      replyToPost: null,
      isDeleted: false,
      $or: [{ retweetedFrom: null }, { quoteContent: { $ne: null } }],
    };
    if (cursor) {
      query._id = { $lt: cursor };
    }
    const limits = Number(limit) || 10;
    const postsRes = await postsModel
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
   
      .populate(
        "replyToUser",
        "_id username firstName lastName email accountType organizationName avatar",
      )
      .populate({
        path: "retweetedFrom",
        populate: [
          {
            path: "author",
            select:
              "_id username firstName lastName email accountType organizationName avatar",
          },
          { path: "media", select: "-mediaId -userId" },
             {path:"poll"}
        ],
      })
      .limit(limits + 1)
      .sort({ _id: -1 })
      .lean({ virtuals: true });

    const hasMore = postsRes.length > limits;
    if (hasMore) postsRes.pop();
    const postIds = postsRes.map((p) => p._id);
    const userReposts = currentUser
      ? await postsModel
          .find({
            author: currentUser._id,
            retweetedFrom: { $in: postIds },
            quoteContent: null,
            isDeleted: false,
          })
          .select("retweetedFrom")
          .lean()
      : [];

    const userRepostSet = new Set(
      userReposts.map((repost) => String(repost.retweetedFrom)),
    );
    const posts = postsRes.map((post) => ({
      ...post,
      isReposted: !!post.retweetedFrom && !post.quoteContent,
      isQuoteRepost: !!post.retweetedFrom && !!post.quoteContent,
      hasVote: currentUser
        ? (post.poll?.options?.some((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          ) ?? false)
        : false,
      isLiked: currentUser
        ? post.postLikes?.some(
            (like) => String(like.userId) === String(currentUser._id),
          )
        : false,
      isUserLogin: !!currentUser,
      isOwner: currentUser
        ? String(post.author._id) === String(currentUser._id)
        : false,

      totalVote: post.poll
        ? post.poll.options?.reduce((prev, curr) => prev + curr.votes, 0)
        : 0,
      isExpired: post.poll ? post.poll.duration <= new Date().getTime() : true,
      votedOption: currentUser
        ? post.poll?.options.find((option) =>
            option.votedBy?.some(
              (id) => String(id) === String(currentUser._id),
            ),
          )
        : false,
      isUserReposted:
        currentUser && !post.retweetedFrom
          ? userRepostSet.has(String(post._id))
          : false,

      postLikes: undefined,
    }));
    const nextCursor = posts.length > 0 ? String(posts[posts.length - 1]._id) : null;
    return {
      posts: posts,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[UserPostsService]", error);
    throw error;
  }
};
