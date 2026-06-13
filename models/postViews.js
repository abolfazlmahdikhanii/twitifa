import mongoose from "mongoose";

const postViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },

    sessionId: {
      type: String,
      required: false,
      index: true,
    },

    deviceId: {
      type: String,
      required: false,
      index: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },

    viewType: {
      type: String,
      enum: ["scroll", "click", "hover", "impression"],
      default: "impression",
    },

    viewDuration: {
      type: Number,
      default: 0,
    },

    fullyVisible: {
      type: Boolean,
      default: false,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    ipAddress: {
      type: String,
      required: false,
    },

    userAgent: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

postViewSchema.index({ user: 1, post: 1 }, { unique: true, sparse: true });
postViewSchema.index({ sessionId: 1, post: 1 });
postViewSchema.index({ deviceId: 1, post: 1 });
postViewSchema.index({ post: 1, viewedAt: -1 });
postViewSchema.index({ user: 1, viewedAt: -1 });

const postViews =
  mongoose.models.Post_Views || mongoose.model("Post_Views", postViewSchema);

export default postViews;
