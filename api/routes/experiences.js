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
    const { company, name, email, batch, cgpaCutoff, experienceType, position, date, OT_description, interview_description, other_comments } = req.body;

    // Validate required fields
    if (!company || !name || !email || !batch || !cgpaCutoff || !experienceType || !position) {
      return res.status(400).json({ error: true, message: 'All required fields must be filled.' });
    }

    // Create a new experience
    const newExperience = new Experience({
      company,
      name,
      email,
      batch,
      cgpaCutoff,
      experienceType,
      position,
      date,
      OT_description,
      interview_description,
      other_comments,
    });

    await newExperience.save();
    res.status(201).json({ success: true, message: 'Experience added successfully!' });
  } catch (error) {
    console.error('Error adding experience:', error);
    res.status(500).json({ error: true, message: 'An error occurred while adding the experience. Please try again later.' });
  }
});

router.post('/search', async (req, res) => {
  const { company, cgpa } = req.body;

  try {
    // If no search parameters are provided, return an empty array
    if (!company && !cgpa) {
      return res.status(200).json([]); // Return an empty array
    }

    const query = {};
    if (company) query.company = company;
    if (cgpa) query.cgpaCutoff = { $gte: parseFloat(cgpa) };

    const experiences = await Experience.find(query).sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Failed to fetch search results' });
  }
});

module.exports = router;
