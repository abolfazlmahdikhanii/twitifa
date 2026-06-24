import mongoose, { Schema } from "mongoose";
const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      index: true,
    },
   
  },
  {
    timestamps: true,
  }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });

const followModel =
  mongoose.models.Follow || mongoose.model("Follow", followSchema);
export default followModel;
