const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  post_id: {
    type: ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
