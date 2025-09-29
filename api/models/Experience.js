const mongoose = require("mongoose");
const interviewRoundSchema = new mongoose.Schema({
  title: { type: String, required: true },       
  type: { 
    type: String, 
    required: true, 
    enum: ["HR", "Technical", "Project", "Resume", "Mixed"] 
  }, 
  description: { type: String, required: true }, 
  duration: { type: Number }
}, { _id: false }); 

const experienceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    batch: { type: String, required: true },
    cgpaCutoff: { type: Number, required: true },
    experienceType: { type: String, required: true, default: "Intern" },
    eligibleBranches: { type: [String], required: true },
    OT_description: { type: String, required: true },
    OT_questions: { type: [String], required: true },
    OT_duration: {type: String},
    interviewRounds: { type: [interviewRoundSchema], required: true },
    other_comments: { type: String, required: true },
    jobDescription: { type: String, required: true },
    numberOfSelections: { type: Number, required: true },
    rounds: { type: [String], required: true },
    name: { type: String, required: true },
    status: { type: String, required: true },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      replies: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        }
      ],
    }
  ],
  verdict: { type: String }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Experience", experienceSchema);
