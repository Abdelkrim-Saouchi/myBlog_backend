const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Like', LikeSchema);
