const Post = require('../models/post');
const Comment = require('../models/comment');

exports.getAllComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('comments')
      .exec();
    res.json(post.comments);
  } catch (err) {
    next(err);
  }
};

exports.createComment = async (req, res, next) => {
  const newComment = new Comment({
    post: req.body.post,
    author: req.body.author,
    content: req.body.content,
  });

  try {
    const post = await Post.findById(req.params.postId).exec();
    post.comments = [newComment._id];
    await newComment.save();
    await post.save();
    res.json(newComment);
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).exec();
    console.log('post:', post);
    post.comments = post.comments.filter(
      (commentId) => commentId === req.params.commentId
    );
    await post.save();
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({
      message: 'Comment deleted',
    });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  const newContent = req.body.content;

  try {
    const comment = await Comment.findById(req.params.commentId).exec();
    comment.content = newContent;
    await comment.save();
    res.json({
      message: 'Comment updated',
    });
  } catch (err) {
    next(err);
  }
};
