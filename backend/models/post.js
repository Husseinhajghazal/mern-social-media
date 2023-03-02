const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    description: { type: String, required: true, maxLength: 100 },
    image: { type: String, required: true },
    imageId: { type: String, required: true },
    likedBy: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
    creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
