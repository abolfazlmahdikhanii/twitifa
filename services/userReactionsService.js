import connectToDB from "@/config/db";
import postLikesModel from "@/models/postLikes";
import postsModel from "@/models/posts";

export const getUserLikedPosts = async (
  userInfo,
  currentUser = null,
  cursor = null,
  limit = 10,
) => {
  try {
    await connectToDB();
    const limits = Number(limit) || 10;

   
    const likesQuery = { userId: userInfo._id };
    if (cursor) {
      likesQuery._id = { $lt: cursor };
    }

    const userLikes = await postLikesModel
      .find(likesQuery)
      .select("postId")
      .sort({ _id: -1 }) 
      .limit(limits + 1)
      .lean();

    const hasMore = userLikes.length > limits;
    if (hasMore) userLikes.pop(); 

    const likedPostIds = userLikes.map((like) => like.postId);

    if (likedPostIds.length === 0) {
      return { posts: [], hasMore: false, nextCursor: null };
    }
    const postsRes = await postsModel
      .find({
        _id: { $in: likedPostIds },
        replyToPost: null, 
        isDeleted: false,
      })
      .populate("author", "_id username email accountType organizationName firstName lastName avatar")
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
          { path: "author", select: "_id username firstName lastName email accountType organizationName avatar" },
          { path: "media", select: "-mediaId -userId" },
             {path:"poll"}
        ],
      })
      .lean({ virtuals: true });

 
    const postMap = new Map(postsRes.map((p) => [p._id.toString(), p]));
    const sortedPosts = likedPostIds
      .map((id) => postMap.get(id.toString()))
      .filter(Boolean); 

  
    const postIds = sortedPosts.map((p) => p._id);
    const userReposts = currentUser
      ? await postsModel.find({
          author: currentUser._id,
          retweetedFrom: { $in: postIds },
          quoteContent: null,
          isDeleted: false,
        }).select("retweetedFrom").lean()
      : [];
    const userRepostSet = new Set(userReposts.map((r) => String(r.retweetedFrom)));

  
    const posts = sortedPosts.map((post) => ({
      ...post,
      isReposted: !!post.retweetedFrom && !post.quoteContent,
      isQuoteRepost: !!post.retweetedFrom && !!post.quoteContent,
      hasVote: currentUser
        ? (post.poll?.options?.some((option) =>
            option.votedBy?.some((id) => String(id) === String(currentUser._id)),
          ) ?? false)
        : false,
      isLiked: currentUser
        ? post.postLikes?.some((like) => String(like.userId) === String(currentUser._id))
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
            option.votedBy?.some((id) => String(id) === String(currentUser._id)),
          )?._id || null
        : null,
      isUserReposted:
        currentUser && !post.retweetedFrom
          ? userRepostSet.has(String(post._id))
          : false,
      postLikes: undefined,
    }));

    
    const nextCursor = userLikes.length > 0 ? String(userLikes[userLikes.length - 1]._id) : null;

    return {
      posts: posts,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[UserLikedPostsService]", error);
    throw error;
  }
};