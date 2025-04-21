const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");

router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find({$or: [{status: "Accepted"}, {status: "Pending"}]}).sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to retrieve experiences" });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const experiences = await Experience.find({ status: "Pending" });
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
      status: "Pending",
    });
    const savedExperience = await experience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to add experience" });
  }
});

router.delete("/delete/:experienceId", async (req, res) => {
  try {
    const { experienceId } = req.params;
    const experience = await Experience.findByIdAndDelete(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.status(200).json({ message: "Experience deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to delete experience" });
  }
});

//a patch route to update the status of an experience
router.patch("/verify/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    experience.status = status;
    const updatedExperience = await experience.save();
    res.status(200).json(updatedExperience);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to update experience status" });
  }
});

module.exports = router;
