/**
 * Migration script to convert OldExperience JSON -> User + Experience
 *
 * Run node migrate.js
 * NOTE: Ensure MONGO_URI is set in your .env file
 * NOTE: Ensure that the internito.json file is in the api directory
 */

const mongoose = require("mongoose");
const fs = require("fs");

require("dotenv").config();

// ------------------ IMPORTING SCHEMAS ------------------ //

const Experience = require("../models/Experience");
const User = require("../models/User");

// ------------------ MIGRATION ------------------ //

async function migrate() {
  await mongoose.connect(process.env.mongo_link);
  console.log("Connected to MongoDB");

  // Load old data from JSON file
  const rawData = fs.readFileSync("internito.json", "utf-8");
  const oldDocs = JSON.parse(rawData);

  console.log(`Found ${oldDocs.length} records in JSON file.`);

  const userCache = new Map(); // avoid duplicate users

  for (const oldDoc of oldDocs) {
    const name = oldDoc.name.trim();
    const username = name.toLowerCase().replace(/\s+/g, ""); // no spaces, lowercase

    let userObj;

    if (userCache.has(username)) {
      userObj = userCache.get(username);
    } else {
      // Split first/last name
      const parts = name.split(" ");
      const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : name;
      const lastName = parts.length > 1 ? parts[parts.length -1] : "";

      const _id = new mongoose.Types.ObjectId();
      userObj = new User({
        _id,
        username,
        firstName,
        lastName,
        email: `${username}@example.com`, // dummy mail id
        branch: "",
        rollNo: `LEGACY_${username}`,
        userId: `legacy-${_id}`,
      });

      try {
        await userObj.save();
        console.log(`Created User: ${username}`);
      } catch (err) {
        console.error(`Error creating user ${username}:`, err.message);
        continue;
      }

      userCache.set(username, userObj);
    }

    // Eligible branches → array
    const eligibleBranches = oldDoc.branch
      ? oldDoc.branch.split(" ").map((b) => b.trim()).filter((b) => b)
      : [];

    // OT questions
    const otQuestions = [
      oldDoc.ot_question1,
      oldDoc.ot_question2,
      oldDoc.ot_question3,
      oldDoc.ot_question4,
    ].filter((q) => q && q.trim());

    // Interview rounds
    const interviewRounds = [];
    if (oldDoc.round1_details) {
      interviewRounds.push({ title: "Round 1", description: oldDoc.round1_details, duration: "" });
    }
    if (oldDoc.round2_details) {
      interviewRounds.push({ title: "Round 2", description: oldDoc.round2_details, duration: "" });
    }
    if (oldDoc.round3_details) {
      interviewRounds.push({ title: "Round 3", description: oldDoc.round3_details, duration: "" });
    }

    const newExperience = new Experience({
      user: userObj._id,
      name,
      company: oldDoc.company,
      batch: oldDoc.batch,
      cgpaCutoff: oldDoc.cgpa_cutoff,
      experienceType: oldDoc.period,
      eligibleBranches,
      OT_description: oldDoc.ot_summary || "",
      OT_duration: "",
      OT_questions: otQuestions,
      interviewRounds,
      other_comments: oldDoc.final_summary || "",
      jobDescription: undefined, // ditch old summary
      numberOfSelections: 0,
      status: "Pending",
      verdict: undefined,
    });

    try {
      await newExperience.save();
      console.log(`Migrated experience for ${name}`);
    } catch (err) {
      console.error(`Error creating experience for ${name}:`, err.message);
    }
  }

  console.log("Migration finished");
  mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed", err);
  mongoose.disconnect();
});
