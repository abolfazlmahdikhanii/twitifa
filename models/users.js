import mongoose from "mongoose";
import postsModel from "./posts";
// Delete the cached model to ensure fresh schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    organizationName: {
      type: String,
      sparse: true,
      required: [
        function () {
          return this.accountType === "legal";
        },
        "نام سازمان برای حساب حقوقی الزامی است",
      ],
    },
    accountType: {
      type: String,
      enum: ["personal", "legal"],
      default: "personal",
    },
    bio: {
      type: String,
      maxLength: 350,
    },
    nationality: {
      type: String,
    },
    address: {
      type: String,
    },
    occupation: {
      type: String,
    },
    birthDate: {
      type: String,
    },
    location: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    website: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarId: {
      type: String,
    },
    profileBg: {
      type: String,
    },
    profileBgId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Validation hook - async version
userSchema.pre("validate", async function () {
  // Check password for credentials provider
  if (this.provider === "credentials" && !this.password) {
    this.invalidate(
      "password",
      "Password is required for credentials provider",
    );
  }

  // Check googleId for google provider
  if (this.provider === "google" && !this.googleId) {
    this.invalidate("googleId", "Google ID is required for google provider");
  }
});
userSchema.index(
  { organizationName: true },
  {
    unique: true,
    partialFilterExpression: {
      accountType: "legal",
      organizationName: { $exists: true, $ne: null },
    },
  },
);
userSchema.virtual("posts", {
  ref: "Posts",
  localField: "_id",
  foreignField: "author",
});

const usersModel = mongoose.models.Users || mongoose.model("Users", userSchema);

export default usersModel;
