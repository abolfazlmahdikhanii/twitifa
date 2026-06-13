import mongoose, { Schema } from "mongoose";
import pollModel from "./polls";
import postLikesModel from "./postLikes";
import postViews from "./postViews";
import postMediaModel from "./postMedia";
const postSchema = new Schema(
  {
    textContent: {
      type: String,
      trim: true,
    },

    poll: {
      type: mongoose.Types.ObjectId,
      ref: "Poll",
    },
    replyToPost: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      index: true,
    },
    replyToUser: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      index: true,
    },
    replySettings: {
      type: String,
      enum: ["all", "following", "mention"],
      default: "all",
      required: true,
    },
    replyLevel: {
      type: Number,
      default: 0,
      max: 5,
      index: true,
    },
    quoteContent: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },

    retweetedFrom: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      index: true,
    },

    originalAuthor: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      index: true,
    },
    isPin: {
      type: Boolean,
      index: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      index: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
postSchema.pre("save", async function () {
  if (!this.$isNew || !this.replyToPost) {
    return;
  }

  try {
    const parent = await mongoose
      .model("Posts")
      .findById(this.replyToPost)
      .select("author replyLevel")
      .lean();

    if (parent) {
      this.replyToUser = parent.author;
      this.replyLevel = (parent.replyLevel || 0) + 1;
    }
  } catch (error) {
    console.error("Reply hook error:", error);
  }
});

postSchema.virtual("directReplies", {
  localField: "_id",
  foreignField: "replyToPost",
  ref: "Posts",
  match: { replyLevel: { $gt: 0 }, isDeleted: false },
  options: { sort: { createdAt: 1 }, limit: 30 },
});
postSchema.virtual("thread", {
  localField: "_id",
  foreignField: "replyToPost",
  ref: "Posts",
  match: { replyLevel: { $gt: 0 }, isDeleted: false },
  options: { sort: { createdAt: 1 }, populate: "author replyToPost.author" },
});
postSchema.virtual("likesCount", {
  localField: "_id",
  foreignField: "postId",
  ref: "Post_Likes",
  count: true,
});
postSchema.virtual("ReplyCount", {
  localField: "_id",
  foreignField: "replyToPost",
  ref: "Posts",
  count: true,
  match: {
    isDeleted: false,
  },
});
postSchema.virtual("postLikes", {
  localField: "_id",
  foreignField: "postId",
  ref: "Post_Likes",
});
postSchema.virtual("media", {
  localField: "_id",
  foreignField: "postId",
  ref: "Post_Media",
});
postSchema.virtual("repostsCount", {
  localField: "_id",
  foreignField: "retweetedFrom",
  ref: "Posts",
  count: true,
  match: {
    isDeleted: false,
  },
});
postSchema.virtual("viewCount", {
  localField: "_id",
  foreignField: "post",
  ref: "Post_Views",
  count: true,
});
const postsModel = mongoose.models.Posts || mongoose.model("Posts", postSchema);
export default postsModel;
