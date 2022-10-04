const mongoose = require("mongoose");
// const Cogitation = require("./Cogitation");

const CommentSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: true,
  // },
  commentText: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  cogitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cogitation",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);
