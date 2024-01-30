const Post = require('../models/post');

exports.getAllPostsList = async (req, res, next) => {
  try {
    const allPosts = await Post.find({})
      .populate('author', 'firstName lastName')
      .exec();
    res.json(allPosts);
  } catch (err) {
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const newPost = new Post({
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    comments: [],
    published: req.body.published,
  });

  try {
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    next(err);
  }
};

exports.getSpecificPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).exec();
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const post = new Post({
    _id: req.params.postId,
    author: req.body.author,
    title: req.body.title,
    content: req.body.content,
    comments: req.body.comments,
    published: req.body.published,
  });
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      post,
      {}
    );
    res.json({ message: 'Post updated' });
  } catch (err) {
    next(err);
  }
};
