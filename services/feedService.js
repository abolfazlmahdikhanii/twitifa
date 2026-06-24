import connectToDB from "@/config/db";
import followModel from "@/models/follows";
import postsModel from "@/models/posts";
import { getAuthorName, getReplyHeader } from "@/utils/post";

export const getFeed = async (
  currentUser = null,
  cursor = null,
  limit = 10,
   followingOnly = false,
) => {
  try {
    await connectToDB();
    const query = { isDeleted: false, replyToPost: null };
    if (followingOnly&&currentUser?._id) {
      const followingRes = await followModel
        .find(
          {
            follower: currentUser._id,
          },
          "following",
        )
        .lean();
      const following = [
        currentUser._id,
        ...followingRes.map((item) => item.following),
      ];
      query.author = {
        $in: following,
      };
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }
    const limits = Number(limit) || 10;

    const posts = await postsModel
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
        {path:"poll"}
        ],
      })
      .limit(limits+1)
      .sort({ _id: -1 })
      .lean({ virtuals: true });

      const hasMore=posts.length>limits
      if(hasMore)posts.pop()

    const postIds = posts.map((p) => p._id);
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

    const buildMeta = (post) => ({
      ...post,
      replyHeader:
        currentUser && currentUser?.username === post.author?.username
          ? "شما پاسخ دادید"
          : getAuthorName(post.author),
      repliedUser: post.replyToPost ? getReplyHeader(post) : null,
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
    });

    const threadedPosts = posts.map(buildMeta);
    const nextCursor =
      threadedPosts.length > 0
        ? String(threadedPosts[threadedPosts.length - 1]._id)
        : null;
    return {
      posts: threadedPosts,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[FeedService]", error);
    throw error;
  }
};
