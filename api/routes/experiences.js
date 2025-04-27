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