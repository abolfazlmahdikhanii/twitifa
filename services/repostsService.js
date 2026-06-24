import connectToDB from "@/config/db";
import postsModel from "@/models/posts";

export const getRepostUsers = async (
  postID,
  currentUser = null,
  cursor = null,
  limit = 20, 
) => {
  try {
    await connectToDB();

    const limits = Number(limit) || 20;

    const query = {
      isDeleted: false,
      retweetedFrom: postID,
      quoteContent: null, 
    };

    if (cursor) {
      query._id = { $lt: cursor };
    }

  
    const reposts = await postsModel
      .find(query)
      .select("author _id") 
      .populate(
        "author",
        "_id username firstName lastName accountType organizationName avatar" 
      )
      .sort({ _id: -1 })
      .limit(limits + 1)
      .lean();

    const hasMore = reposts.length > limits;
    if (hasMore) reposts.pop();

    
    const users = reposts
      .map((repost) => {
        if (!repost.author) return null;
        return {
          ...repost.author,
        
          isOwner: currentUser
            ? String(repost.author._id) === String(currentUser._id)
            : false,
        };
      })
      .filter(Boolean); 

 
    const nextCursor =
      reposts.length > 0
        ? String(reposts[reposts.length - 1]._id)
        : null;

    return {
      users, 
      hasMore,
      nextCursor,
    };
  } catch (error) {
    console.error("[RepostUsersService]", error);
    throw error;
  }
};