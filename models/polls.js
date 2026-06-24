const { Schema, default: mongoose } = require("mongoose");

const pollsSchema = new Schema(
  {
    options: [
      {
        optionText: { type: String, required: true },
        votes: { type: Number, default: 0 },
        votedBy: [{ type: mongoose.Types.ObjectId, ref: "Users" }],
      },
    ],
    duration: { type: Number },

    // showVotedBy: {
    //   type: String,
    //   enum: ["anybody", "self", "all"],
    //   default: "anybody",
    // },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
  },
  { timestamps: true },
);

const pollModel = mongoose.models.Poll || mongoose.model("Poll", pollsSchema);
export default pollModel;
