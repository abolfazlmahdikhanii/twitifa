import mongoose from "mongoose";

const otp = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["signup", "reset"],
      required: true,
      default:"signup"
    },

    userData: {
      type: Object,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);


otp.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Otp || mongoose.model("Otp", otp);
