const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-delete expired tokens
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const refreshTokenModel =
  mongoose.models.Refresh_Token || mongoose.model("Refresh_Token", schema);

export default refreshTokenModel;
