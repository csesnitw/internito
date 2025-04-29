const express = require("express");
const router = express.Router();
const Experience = require("../models/Experience");

// Include npm packages
const natural = require("natural");
const aposToLexForm = require("apos-to-lex-form");
const SpellCorrector = require("spelling-corrector");
const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();
const stopword = require("stopword");


const getSentiment = text => {
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid input: text must be a non-empty string');
  }
  // Check if the text is empty after removing spaces
  if (text.trim() === '') {
    return 0; // Neutral sentiment
  }

  // NLP Logic
  // Convert all data to its standard form and lowercase
  const lexData = aposToLexForm(text)
    .toLowerCase()
    .replace(/[^a-zA-Z\s]+/g, "");

  // Tokenization
  const tokenConstructor = new natural.WordTokenizer();
  const tokenizedData = tokenConstructor.tokenize(lexData);
  //console.log("Tokenized Data: ",tokenizedData);

  const fixedSpelling = tokenizedData.map((word) => spellCorrector.correct(word));

  // Remove Stopwords
  const filteredData = stopword.removeStopwords(fixedSpelling);
  //console.log("After removing stopwords: ",filteredData);

  // Stemming
  const Sentianalyzer =
  new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const analysis_score = Sentianalyzer.getSentiment(filteredData);
  //console.log("Sentiment Score: ",analysis_score);
  return analysis_score;
}



// Get all experiences sorted by date
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

// Add a new experience
router.post("/addExperience", async (req, res) => {
  try {
    const { company, name,rollNo, email, batch, cgpaCutoff, experienceType, position, OT_description, interview_description, other_comments } = req.body;

    // Validate required fields
    if (!company || !name || !rollNo || !email || !batch || !cgpaCutoff || !experienceType || !position || !OT_description || !interview_description || !other_comments) {
      return res.status(400).json({ error: true, message: 'All required fields must be filled.' });
    }

    text = OT_description + " " + interview_description + " " + other_comments;
    // Get sentiment score
    const sentimentScore = getSentiment(text);
    if (sentimentScore < 0) {
      return res.status(400).json({ error: true, message: 'Sentiment score is negative. Please check your input.' });
    }
    // Create a new experience
    const newExperience = new Experience({
      company,
      name,
      rollNo,
      email,
      batch,
      cgpaCutoff,
      experienceType,
      position,
      OT_description,
      interview_description,
      other_comments,
      status: "Pending",
    });
    const savedExperience = await newExperience.save();
    res.status(201).json(savedExperience);
  } catch (error) {
    console.error('Error fetching company search results:', error);
    res.status(500).json({ message: 'Failed to fetch company search results' });
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

/
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