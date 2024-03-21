const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    readTime: { type: Number, required: true },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "Like",
    },
    topics: {
      type: [Schema.Types.ObjectId],
      ref: "Topic",
    },
    published: Boolean,
    imgURL: String,
    imgID: String,
  },
  { timestamps: true },
);

PostSchema.virtual("creationDate").get(function () {
  const formattedDate = format(this.createdAt, "MMM dd yyyy");
  return formattedDate;
});

PostSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Post", PostSchema);
