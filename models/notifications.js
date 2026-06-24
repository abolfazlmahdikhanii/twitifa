import mongoose, { Schema } from "mongoose";
import usersModel from "./users";
const schema = new Schema(
  {
    recipientId: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "retweet",
        "follow",
        "mention",
        "reply",
        "quote",
        "alert",
        "admin",
      ],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    entityType: {
      type: String,
      enum: ["post", "user", "comment"],
    },
    actorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const notifyModel =
  mongoose.models.Notifications || mongoose.model("Notifications", schema);
export default notifyModel;
