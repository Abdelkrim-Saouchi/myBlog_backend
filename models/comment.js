const mongoose = require("mongoose");
const { format } = require("date-fns");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "userModel",
    },
    userModel: { type: String, required: true, enum: ["User", "Author"] },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

CommentSchema.virtual("creationDate").get(function () {
  const formattedDate = format(this.createdAt, "MMM dd");
  return formattedDate;
});

CommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", CommentSchema);
