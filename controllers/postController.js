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
    const post = await Post.findById(req.params.id).exec();
    res.json(post);
  } catch (err) {
    next(err);
  }
};
