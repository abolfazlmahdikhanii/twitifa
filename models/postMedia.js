const { Schema, default: mongoose } = require("mongoose");
import postsModel from "./posts";
import usersModel from "./users";
const postMediaSchema = new Schema(
  {
    url: { type: String, required: true },
    mediaId: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ["image", "gif", "video"],
      default: "image",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    posterUrl: {
      type: String,
    },
    time: {
      type: String,
    },
    size: {
      type: String,
    },
    blurDataUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const postMediaModel =
  mongoose.models.Post_Media || mongoose.model("Post_Media", postMediaSchema);

export default postMediaModel;
