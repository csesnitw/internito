const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");

// Get all experiences sorted by date
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Failed to retrieve experiences" });
  }
});

// Add a new experience
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

// Search all experiences sorted by date
router.post('/search', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Failed to fetch search results' });
  }
});

// Search by company name (regex) and/or CGPA, grouped by company
router.post('/company', async (req, res) => {
  const { company, cgpa } = req.body;

  try {
    const query = {};

    // Match company name using regex (case-insensitive)
    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    // Filter by CGPA cutoff if provided
    if (cgpa) {
      query.cgpaCutoff = { $lte: parseFloat(cgpa) };
    }

    const experiences = await Experience.find(query).sort({ date: -1 });

    // Group experiences by company
    const groupedByCompany = experiences.reduce((acc, experience) => {
      if (!acc[experience.company]) {
        acc[experience.company] = [];
      }
      acc[experience.company].push(experience);
      return acc;
    }, {});

    res.status(200).json(groupedByCompany);
  } catch (error) {
    console.error('Error fetching company search results:', error);
    res.status(500).json({ message: 'Failed to fetch company search results' });
  }
});

module.exports = router;