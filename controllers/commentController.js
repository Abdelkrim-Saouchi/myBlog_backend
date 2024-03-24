const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

// exports.getAllComments = async (req, res, next) => {
//   try {
//     const post = await Post.findById(req.params.postId)
//       .populate("comments")
//       .exec();
//     res.json(post.comments);
//   } catch (err) {
//     next(err);
//   }
// };

exports.createComment = [
  body("commentText", "Comment must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let newComment = null;
    if (req.user.role === "author") {
      newComment = new Comment({
        post: req.body.post,
        author: req.user._id,
        userModel: "Author",
        content: req.body.content,
      });
    } else {
      newComment = new Comment({
        post: req.body.post,
        author: req.user._id,
        userModel: "User",
        content: req.body.content,
      });
    }

    try {
      const post = await Post.findById(req.params.postId).exec();
      post.comments = [...post.comments, newComment._id];
      await newComment.save();
      await post.save();
      res.json(newComment);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).exec();
    post.comments = post.comments.filter(
      (commentId) => commentId.toString() !== req.params.commentId,
    );
    await post.save();
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({
      message: "Comment deleted",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = [
  body("commentText", "Comment must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newContent = req.body.content;

    try {
      const comment = await Comment.findById(req.params.commentId).exec();
      if (!comment) {
        return res.status(404);
      }
      comment.content = newContent;
      await comment.save();
      res.json({
        message: "Comment updated",
      });
    } catch (err) {
      next(err);
    }
  },
];

exports.getComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    return res.json(comment);
  } catch (err) {
    next(err);
  }
};
