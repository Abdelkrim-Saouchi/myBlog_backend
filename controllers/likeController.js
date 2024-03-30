const Like = require("../models/like");
const Post = require("../models/post");

exports.createLike = async (req, res, next) => {
  try {
    const oldLike = await Like.findOne({ owner: req.user._id }).exec();

    if (oldLike) {
      return res.status(403).json({ message: "already liked" });
    }
    const like = new Like({
      owner: req.user._id,
    });
    await like.save();
    const post = await Post.findById(req.params.postId).exec();
    post.likes = [...post.likes, like];
    post.likesCount = post.likes.length;
    await post.save();
    res.status(201).json({ message: "like created", likeId: like._id });
  } catch (err) {
    next(err);
  }
};

exports.getLike = async (req, res, next) => {
  try {
    const like = await Like.findById(req.params.likeId).exec();
    if (like) {
      return res.json({ message: "like already exists", owner: like.owner });
    }
    return res.status(404).json({ message: "like not found" });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const deletedLike = await Like.findByIdAndDelete(req.params.likeId);
    if (!deletedLike) {
      return res.status(409);
    }
    const post = await Post.findById(req.params.postId).exec();

    post.likes = post.likes.filter((id) => id.toString() !== req.params.likeId);
    post.likesCount = post.likes.length;

    const savedPost = await post.save();
    if (!savedPost) {
      return res.status(409);
    }
    res.status(204);
  } catch (err) {
    next(err);
  }
};

exports.getLikedStatus = async (req, res, next) => {
  try {
    const like = await Like.findOne({ owner: req.user._id }).exec();
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }
    res.json({ message: "Like exists", likeId: like._id });
  } catch (err) {
    next(err);
  }
};
