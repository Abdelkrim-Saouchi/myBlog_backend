const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: 'Comment',
    },
    published: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
