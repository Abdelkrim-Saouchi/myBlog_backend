exports.getAllPostsList = (req, res) => {
  res.json({ posts: ['Hello'] });
};

exports.createPost = (req, res) => {
  res.json({ message: 'post created' });
};
