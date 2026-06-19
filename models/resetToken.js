import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    token: {
      type: String,
      required: true, 
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: "0s" }, 
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResetToken ||
  mongoose.model("ResetToken", resetTokenSchema);