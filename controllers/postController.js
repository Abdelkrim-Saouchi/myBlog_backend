const Post = require("../models/post");
const { body, query, validationResult } = require("express-validator");
const cloudinary = require("../config/cloudinary");

// Global variables
const ARTICLES_PER_PAGE = 2;

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
  const page = req.query?.p - 1 || 0;
  const sortBy = req.query?.sortBy;
  try {
    const articlesNumber = await Post.countDocuments({ published: true });
    const totalPages = Math.ceil(articlesNumber / ARTICLES_PER_PAGE);
    let allPosts;
    if (sortBy === "likes") {
      allPosts = await Post.find({ published: true })
        .populate("author", "firstName lastName")
        .populate("topics")
        .sort({ likes: -1 })
        .limit(ARTICLES_PER_PAGE)
        .skip(page * ARTICLES_PER_PAGE)
        .exec();
    } else if (sortBy === "comments") {
      allPosts = await Post.find({ published: true })
        .populate("author", "firstName lastName")
        .populate("topics")
        .sort({ comments: -1 })
        .limit(ARTICLES_PER_PAGE)
        .skip(page * ARTICLES_PER_PAGE)
        .exec();
    } else {
      allPosts = await Post.find({ published: true })
        .populate("author", "firstName lastName")
        .limit(ARTICLES_PER_PAGE)
        .skip(page * ARTICLES_PER_PAGE)
        .populate("topics")
        .exec();
    }
    res.json({ articles: allPosts, totalPages: totalPages });
  } catch (err) {
    next(err);
  }
};

exports.createPost = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Article Content must not be empty").isLength({ min: 1 }),
  body("readTime", "readTime must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("topics.*", "invalid topics").escape(),
  body("published", "invalid published value").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const uploadResult = await cloudinary.uploader.upload(req.body.file, {
        folder: "blog",
      });
      const imgURL = uploadResult.secure_url;
      const imgID = uploadResult.public_id;

      const newPost = new Post({
        author: req.user._id,
        title: req.body.title,
        content: req.body.content,
        readTime: req.body.readTime,
        comments: [],
        likes: [],
        topics: req.body.topics,
        published: req.body.published,
        imgURL: imgURL,
        imgID: imgID,
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
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
    if (!post) {
      return res.status(404);
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (deletedPost.imgID) {
      await cloudinary.uploader.destroy(deletedPost.imgID);
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updatePost = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("content", "Article Content must not be empty").isLength({ min: 1 }),
  body("readTime", "readTime must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("topics.*", "invalid topics").escape(),
  body("published", "invalid published value").escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const oldPost = await Post.findById(req.params.postId).exec();
      const file = req.body.file;
      let newPost;

      // if new image did not uplaoded
      if (file === "") {
        newPost = new Post({
          _id: req.params.postId,
          author: req.body.author,
          title: req.body.title,
          content: req.body.content,
          readTime: req.body.readTime,
          comments: oldPost.comments,
          likes: oldPost.likes,
          topics: req.body.topics,
          published: req.body.published,
          imgURL: oldPost.imgURL,
          imgID: oldPost.imgID,
        });
      }
      // if new image uploaded
      else {
        // if the new image is not image type
        if (!file.includes("image")) {
          const err = new Error("File must be image type");
          console.log("err1:", err);
          return next(err);
        }
        // delete old image on cloudinary
        if (oldPost.imgID) {
          await cloudinary.uploader.destroy(oldPost.imgID);
        }
        // updload new image to cloudinary
        const uploadResult = await cloudinary.uploader.upload(file, {
          folder: "blog",
        });
        const imgURL = uploadResult.secure_url;
        const imgID = uploadResult.public_id;

        newPost = new Post({
          _id: req.params.postId,
          author: req.body.author,
          title: req.body.title,
          content: req.body.content,
          readTime: req.body.readTime,
          comments: oldPost.comments,
          likes: oldPost.likes,
          topics: req.body.topics,
          published: req.body.published,
          imgURL: imgURL,
          imgID: imgID,
        });
      }

      await Post.findByIdAndUpdate(req.params.postId, newPost, {});
      res.json({ message: "Post updated" });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];

exports.searchPost = [
  query("q", "Invalid search input").trim().escape(),
  query("p", "Invalid search input").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const q = req.query.q;
    const p = req.query.p - 1 || 0;
    try {
      const count = await Post.countDocuments({
        $text: { $search: `\"${q}\"` },
        published: true,
      });
      const posts = await Post.find({
        $text: { $search: `\"${q}\"` },
        published: true,
      })
        .sort({
          score: { $meta: "textScore" },
        })
        .limit(ARTICLES_PER_PAGE)
        .skip(p * ARTICLES_PER_PAGE)
        .populate("author", "firstName lastName")
        .populate("topics")
        .exec();
      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
      res.json({ articles: posts, totalPages: totalPages });
    } catch (err) {
      next(err);
    }
  },
];

exports.filterPosts = [
  query("q", "invalid filter query").trim().escape(),
  query("p", "invalid filter query").trim().escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }
    const q = req.query?.q === "" ? null : req.query.q;
    const p = req.query?.p - 1 || 0;
    const topicsList = q?.split(";") || [];
    try {
      const count = await Post.countDocuments({
        topics: { $in: topicsList },
        published: true,
      });
      const posts = await Post.find({
        topics: { $in: topicsList },
        published: true,
      })
        .limit(ARTICLES_PER_PAGE)
        .skip(p * ARTICLES_PER_PAGE)
        .populate("author", "firstName lastName")
        .populate("topics")
        .exec();
      const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
      return res.json({ articles: posts, totalPages: totalPages });
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
];
