const mongoose = require("mongoose");
const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  batch: { type: String, required: true },
  cgpaCutoff: { type: Number, required: true },
  experienceType: { type: String, required: true },
  eligibleBranches: [{ type: String }],
  OT_description: { type: String }, // <-- add this
  OT_questions: [{ type: String }],
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
  status: { type: String, required: true },
  verdict: {
    type: String,
    enum: [
      "REJ_OT",    // Didn't get past OT
      "SEL_OT",    // Got past OT
      "SEL_INT",   // Selected
      "REJ_INT",   // Rejected in interview
    ],
    default: undefined
  }
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);