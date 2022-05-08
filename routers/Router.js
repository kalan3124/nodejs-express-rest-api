const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();

// users routes
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.post("/create", async (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const users = await user.save();
    res.json(users);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.get("/search/:id", async (req, res) => {
  try {
    const users = await User.find().where("_id").equals(req.params.id);
    res.json(users);
  } catch (error) {
    res.send("error: " + error);
  }
});
// end users route

// posts route
router.get("/posts/user", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({ path: "user_id", select: "name email" })
      .select("content title");
    res.json(posts);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.post("/post/create", async (req, res) => {
  const post = new Post({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    user_id: req.body.user_id,
  });
  try {
    const postN = await post.save();
    res.json(postN);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.post("/post/comment/create/:id", async (req, res) => {
  const comment = new Comment({
    title: req.body.title,
    content: req.body.content,
    post_id: req.params.id,
  });
  try {
    const comments = await comment.save();
    res.json(comments);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.get("/posts/comments", async (req, res) => {
  let data = [];
  try {
    const posts = await Post.find();
    for (const val of posts) {
      let coms = await Comment.find({ post_id: val._id });
      data.push({
        post_id: val._id,
        title: val.title,
        content: val.content,
        comments: coms,
      });
    }
    res.json(data);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.delete("/posts/remove", async (req, res) => {
  try {
    Post.findByIdAndRemove(req.body.id, function (err, doc) {
      if (err) throw err;
      Comment.deleteMany(
        { post_id: req.body.id },
        function (err, doc) {
          if (err) throw err;
          res.send("post and related comments has been deleted");
        }
      );
    });
  } catch (error) {
    res.send("error: " + error);
  }
});
// end posts route

module.exports = router;
