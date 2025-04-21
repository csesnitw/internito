const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  cgpaCutoff: {
    type: Number,
    required: true,
  },
  experienceType: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  OT_description: {
    type: String,
    required: true,
  },
  interview_description: {
    type: String,
    required: true,
  },
  other_comments: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Experience", experienceSchema);
