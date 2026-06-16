import connectToDB from "@/config/db";
import postsModel from "@/models/posts";
import hashtagModel from "@/models/hashtag"; 

export const getHashtagPosts = async ( 
  hashtagName,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();
    const limits = Number(limit) || 10;

    const hashtagPosts = await hashtagModel
      .findOne({ name: hashtagName }, "posts")
      .lean();

    if (!hashtagPosts || !hashtagPosts.posts || hashtagPosts.posts.length === 0) {
      return { posts: [], hasMore: false, nextCursor: null };
    }

   
    const idQuery = { $in: hashtagPosts.posts };
    if (cursor) {
      idQuery.$lt = cursor;
    }

    const query = {
      _id: idQuery,
      isDeleted: false,
    };

    
    const postsRes = await postsModel
      .find(query)
      .populate(
        "author",
        "username email accountType organizationName firstName lastName",
      )
      .populate("media", "-mediaId -userId")
      .populate("poll")
      .populate("likesCount")
      .populate("repostsCount")
      .populate("ReplyCount")
      .populate("viewCount")
      .populate("postLikes", "userId")
      .populate({
        path: "retweetedFrom",
        populate: [
          {
            path: "author",
            select:
              "username firstName lastName email accountType organizationName",
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

    const postWithVote = postsRes.map((post) => ({
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
          )?._id || null
        : null,
      isUserReposted:
        currentUser && !post.retweetedFrom
          ? userRepostSet.has(String(post._id))
          : false,

      postLikes: undefined,
    }));

    const nextCursor =
      postWithVote.length > 0
        ? String(postWithVote[postWithVote.length - 1]._id)
        : null;

    return {
      posts: postWithVote,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[HashtagPostsService]", error);
    throw error;
  }
};