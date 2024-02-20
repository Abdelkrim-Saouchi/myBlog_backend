const Post = require('../models/post');

// for specific author
exports.getAuthorAllPostsList = async (req, res, next) => {
  try {
    const allPosts = await Post.find({ author: req.user._id })
      .populate('author', 'firstName lastName')
      .populate('topics')
      .exec();
    res.json(allPosts);
  } catch (err) {
    next(err);
  }
};

// for users
exports.getAllPublishedPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({ published: true })
      .populate('author', 'firstName lastName')
      .populate('topics')
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
    readTime: req.body.readTime,
    comments: [],
    likes: [],
    topics: req.body.topics,
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
    const post = await Post.findById(req.params.postId)
      .populate('author', 'firstName lastName')
      .populate('topics')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username',
        },
      })
      .exec();
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
  try {
    const oldPost = await Post.findById(req.params.postId).exec();

    const newPost = new Post({
      _id: req.params.postId,
      author: req.body.author,
      title: req.body.title,
      content: req.body.content,
      readTime: req.body.readTime,
      comments: oldPost.comments,
      likes: oldPost.likes,
      topics: req.body.topics,
      published: req.body.published,
    });

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      newPost,
      {}
    );
    res.json({ message: 'Post updated' });
  } catch (err) {
    next(err);
  }
};
