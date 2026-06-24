import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    hashtag: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: String,
    count: { type: Number, default: 0 },
    posts: [{ type: mongoose.Types.ObjectId, ref: "Posts" }],
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });
schema.set("toObject", { virtuals: true });
const hashtagModel =
  mongoose.models.Hashtags || mongoose.model("Hashtags", schema);

export default hashtagModel;
