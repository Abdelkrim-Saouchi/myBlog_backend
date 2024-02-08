const Like = require('../models/like');
const Post = require('../models/post');

exports.createLike = async (req, res, next) => {
  const like = new Like({
    owner: req.user._id,
  });

  try {
    await like.save();
    const post = await Post.findById(req.params.postId).exec();
    post.likes = [...post.likes, like];
    await post.save();
    res.json({ message: 'like created' });
  } catch (err) {
    next(err);
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    await Like.findByIdAndDelete(req.params.likeId);
    const post = await Post.findById(req.params.postId).exec();
    post.likes = post.likes.filter((like) => like._id === req.params.likeId);
    await post.save();
    res.json({ message: 'Like deleted' });
  } catch (err) {
    next;
  }
};
