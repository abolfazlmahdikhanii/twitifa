import connectToDB from "@/config/db";
import postMediaModel from "@/models/postMedia";
import postsModel from "@/models/posts";
import usersModel from "@/models/users";
import mongoose from "mongoose";

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSearchResult = async (
  search,
  currentUser = null,
  cursor = null,
  limit = 10,
  type = "top",
) => {
  try {
    await connectToDB();

    if (!search || search.trim().length < 1) {
      return { result: [], matchedUsers: [], hasMore: false, nextCursor: null };
    }

    const safeSearch = escapeRegex(search.trim());
    const limits = Number(limit) || 10;

    const userSearchQuery = {
      $or: [
        { username: { $regex: safeSearch, $options: "i" } },
        { organizationName: { $regex: safeSearch, $options: "i" } },
        { firstName: { $regex: safeSearch, $options: "i" } },
        { lastName: { $regex: safeSearch, $options: "i" } },
      ],
    };

    if (type === "users") {
      const userQuery = { ...userSearchQuery };
      if (cursor) userQuery._id = { $lt: new mongoose.Types.ObjectId(cursor) };

      const matchedUsers = await usersModel
        .find(userQuery)
        .select(
          "_id username email accountType organizationName firstName lastName",
        )
        .sort({ _id: -1 })
        .limit(limits + 1)
        .lean();

      const hasMore = matchedUsers.length > limits;
      if (hasMore) matchedUsers.pop();

      return {
        result: [],
        matchedUsers,
        hasMore,
        nextCursor: matchedUsers.length
          ? matchedUsers[matchedUsers.length - 1]._id
          : null,
      };
    }

    const matchedUserIds = await usersModel
      .find(userSearchQuery)
      .select("_id")
      .lean();
    const userIdsArray = matchedUserIds.map((u) => u._id);

    
    let postQuery = {
      isDeleted: false,
      $and: [
        { $or: [{ replyToPost: null }, { replyToPost: { $exists: false } }] },

        {
          $or: [
            { textContent: { $regex: safeSearch, $options: "i" } },
            { quoteContent: { $regex: safeSearch, $options: "i" } },
            ...(userIdsArray.length > 0
              ? [{ author: { $in: userIdsArray } }]
              : []),
          ],
        },
      ],
    };

    if (type === "media") {
      const allMediaPostIds = await postMediaModel.distinct("postId");

      if (allMediaPostIds.length === 0) {
        return {
          result: [],
          matchedUsers: [],
          hasMore: false,
          nextCursor: null,
        };
      }

      postQuery.$and.push({ _id: { $in: allMediaPostIds } });
    }

    if (cursor) {
      postQuery._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const sortCriteria = { _id: -1 };

    const postsRes = await postsModel
      .find(postQuery)
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
      .populate(
        "replyToUser",
        "_id username firstName lastName email accountType organizationName",
      )
      .populate({
        path: "retweetedFrom",
        populate: [
          {
            path: "author",
            select:
              "_id username firstName lastName email accountType organizationName",
          },
          { path: "media", select: "-mediaId -userId" },
             {path:"poll"}
        ],
      })
      .sort(sortCriteria)
      .limit(limits + 1)
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
      userReposts.map((r) => String(r.retweetedFrom)),
    );

    const posts = postsRes.map((post) => ({
      ...post,
      isReposted: !!post.retweetedFrom && !post.quoteContent,
      isQuoteRepost: !!post.retweetedFrom && !!post.quoteContent,
      hasVote: currentUser
        ? (post.poll?.options?.some((opt) =>
            opt.votedBy?.some((id) => String(id) === String(currentUser._id)),
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
        ? post.poll.options?.reduce((a, b) => a + b.votes, 0)
        : 0,
      isExpired: post.poll ? post.poll.duration <= Date.now() : true,
      votedOption: currentUser
        ? post.poll?.options.find((opt) =>
            opt.votedBy?.some((id) => String(id) === String(currentUser._id)),
          )
        : null,
      isUserReposted:
        currentUser && !post.retweetedFrom
          ? userRepostSet.has(String(post._id))
          : false,
      postLikes: undefined,
    }));

    const nextCursor = posts.length > 0 ? String(posts[posts.length - 1]._id) : null;

    const topMatchedUsers = await usersModel
      .find(userSearchQuery)
      .select(
        "_id username email accountType organizationName firstName lastName",
      )
      .limit(3)
      .lean();

    return {
      result: posts,
      matchedUsers: topMatchedUsers,
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[SearchService]", error);
    throw error;
  }
};
