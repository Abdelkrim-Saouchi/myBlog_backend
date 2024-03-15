const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

// for specific author
exports.getAuthorAllPostsList = async (req, res, next) => {
  try {
    const allPosts = await Post.find({ author: req.user._id })
      .populate("author", "firstName lastName")
      .populate("topics")
      .exec();
    res.json({ articles: allPosts });
  } catch (err) {
    next(err);
  }
};

// for users
exports.getAllPublishedPosts = async (req, res, next) => {
  const page = req?.query?.p - 1 || 0;
  const ARTICLES_PER_PAGE = 2;
  try {
    const articlesNumber = await Post.countDocuments({ published: true });
    const totalPages = Math.ceil(articlesNumber / ARTICLES_PER_PAGE);
    const allPosts = await Post.find({ published: true })
      .limit(ARTICLES_PER_PAGE)
      .skip(page * ARTICLES_PER_PAGE)
      .populate("author", "firstName lastName")
      .populate("topics")
      .exec();
    res.json({ articles: allPosts, totalPages: totalPages });
  } catch (err) {
    next(err);
  }
};

exports.createPost = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Article Content must not be empty").isLength({ min: 1 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newPost = new Post({
      author: req.user._id,
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
      console.log("err:", err);
      next(err);
    }
  },
];

exports.getSpecificPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "firstName lastName")
      .populate("topics")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username firstName lastName",
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
    res.json({ message: "Post deleted" });
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
      {},
    );
    res.json({ message: "Post updated" });
  } catch (err) {
    next(err);
  }
};

exports.searchPost = async (req, res, next) => {
  const q = req.query.q;
  console.log("q", q);
  try {
    const posts = await Post.find({ $text: { $search: `\"${q}\"` } })
      .sort({
        score: { $meta: "textScore" },
      })
      .populate("author", "firstName lastName")
      .populate("topics")
      .exec();
    res.json({ articles: posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
