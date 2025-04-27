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

// For conversion of contractions to standard lexicon
const wordDict = {
    "aren't": "are not",
    "can't": "cannot",
    "couldn't": "could not",
    "didn't": "did not",
    "doesn't": "does not",
    "don't": "do not",
    "hadn't": "had not",
    "hasn't": "has not",
    "haven't": "have not",
    "he'd": "he would",
    "he'll": "he will",
    "he's": "he is",
    "i'd": "I would",
    "i'd": "I had",
    "i'll": "I will",
    "i'm": "I am",
    "isn't": "is not",
    "it's": "it is",
    "it'll": "it will",
    "i've": "I have",
    "let's": "let us",
    "mightn't": "might not",
    "mustn't": "must not",
    "shan't": "shall not",
    "she'd": "she would",
    "she'll": "she will",
    "she's": "she is",
    "shouldn't": "should not",
    "that's": "that is",
    "there's": "there is",
    "they'd": "they would",
    "they'll": "they will",
    "they're": "they are",
    "they've": "they have",
    "we'd": "we would",
    "we're": "we are",
    "weren't": "were not",
    "we've": "we have",
    "what'll": "what will",
    "what're": "what are",
    "what's": "what is",
    "what've": "what have",
    "where's": "where is",
    "who'd": "who would",
    "who'll": "who will",
    "who're": "who are",
    "who's": "who is",
    "who've": "who have",
    "won't": "will not",
    "wouldn't": "would not",
    "you'd": "you would",
    "you'll": "you will",
    "you're": "you are",
    "you've": "you have",
    "'re": " are",
    "wasn't": "was not",
    "we'll": " will",
    "didn't": "did not"
}

// Contractions to standard lexicons Conversion
const convertToStandard = text => {
    const data = text.split(' ');
    data.forEach((word, index) => {
        Object.keys(wordDict).forEach(key => {
            if (key === word.toLowerCase()) {
                data[index] = wordDict[key]
            };
        });
    });

    return data.join(' ');
}

// LowerCase Conversion
const convertTolowerCase = text => {
    return text.toLowerCase();
}

// Pure Alphabets extraction
const removeNonAlpha = text => {

    // This specific Regex means that replace all
    //non alphabets with empty string.
    return text.replace(/[^a-zA-Z\s]+/g, '');
}

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