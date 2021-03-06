const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const verifyToken = require("../auth");
const { SECRET } = require("../const");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const router = express.Router();

// users routes

router.post("/login", async (req, res) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    var token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: 86400, // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });
});

router.post("/create", async (req, res) => {
  var hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const users = await user.save();
    res.json(user);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.get("/search/:id", verifyToken, async (req, res) => {
  try {
    const users = await User.find().where("_id").equals(req.params.id);
    res.json(users);
  } catch (error) {
    res.send("error: " + error);
  }
});
// end users route

// posts route
router.get("/posts/user", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({ path: "user_id", select: "name email" })
      .select("content title");
    res.json(posts);
  } catch (error) {
    res.send("error: " + error);
  }
});

router.post("/post/create", verifyToken, async (req, res) => {
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

router.post("/post/comment/create/:id", verifyToken, async (req, res) => {
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

router.get("/posts/comments", verifyToken, async (req, res) => {
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
      Comment.deleteMany({ post_id: req.body.id }, function (err, doc) {
        if (err) throw err;
        res.send("post and related comments has been deleted");
      });
    });
  } catch (error) {
    res.send("error: " + error);
  }
});
// end posts route

// // add the middleware function
// router.use(function (user, req, res, next) {
//   res.status(200).send(user);
// });

module.exports = router;
