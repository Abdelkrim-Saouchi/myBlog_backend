const Topic = require("../models/topic");
const { body, validationResult } = require("express-validator");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await Topic.find({}).exec();
    return res.json({ topics: topics });
  } catch (err) {
    next(err);
  }
};

exports.getSpecificTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id).exec();
    return res.json({ topic: topic });
  } catch (err) {
    next(err);
  }
};

exports.createTopic = [
  body("name", "topic name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid topic name", errors: errors.array() });
    }

    const newTopic = new Topic({
      name: req.body.name,
    });
    try {
      await newTopic.save();
      res.json({ message: "new Topic created" });
    } catch (err) {
      next(err);
    }
  },
];

exports.deleteTopic = async (req, res, next) => {
  try {
    const deleted = await Topic.findByIdAndDelete(req.params.topicId).exec();
    res.json({ message: "Topic deleted", data: deleted });
  } catch (err) {
    next(err);
  }
};

exports.updateTopic = [
  body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Invalid inputs", errors: errors.array() });
    }

    const topic = new Topic({
      name: req.body.name,
      _id: req.params.topicId,
    });
    try {
      await Topic.findByIdAndUpdate(req.params.topicId, topic, {});
      res.json({ message: "Topic updated" });
    } catch (err) {
      next(err);
    }
  },
];
