const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  batch: { type: String, required: true },
  cgpaCutoff: { type: Number, required: true },
  experienceType: { type: String, required: true },
  eligibleBranches: [{ type: String }],
  OT_description: { type: String },
  OT_questions: [
    {
      question: { type: String },
      solutionText: { type: String },
      solutionCode: { type: String },
      language: { type: String },
      references: { type: String },
    },
  ],
  interviewRounds: [
    {
      title: String,
      description: String,
    }
  ],
  other_comments: { type: String },
  jobDescription: { type: String }, // <-- add this
  numberOfSelections: { type: Number }, // <-- add this
  name: { type: String, required: true }, // <-- add this
  status: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);