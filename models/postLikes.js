import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const postLikesModel =
  mongoose.models.Post_Likes || mongoose.model("Post_Likes", likeSchema);
export default postLikesModel;
