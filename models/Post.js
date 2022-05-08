const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
//   comments: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Comment",
//     },
//   ],
});

module.exports = mongoose.model("Post", postSchema);
