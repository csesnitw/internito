const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");

router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to retrieve experiences" });
  }
});

router.post("/addExperience", async (req, res) => {
  try {
    if (!req.body.experienceType in ["Intern", "Job"]) {
      return res.status(400).json({ message: "Invalid experience type" });
    }
    const experience = new Experience({
      company: req.body.company,
      name: req.body.name,
      email: req.body.email,
      batch: req.body.batch,
      cgpaCutoff: req.body.cgpaCutoff,
      experienceType: req.body.experienceType,
      position: req.body.position,
      date: req.body.date,
      OT_description: req.body.OT_description,
      interview_description: req.body.interview_description,
      other_comments: req.body.other_comments,
    });
    const savedExperience = await experience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add experience" });
  }
});

module.exports = router;
