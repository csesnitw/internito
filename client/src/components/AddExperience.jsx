import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NAMES } from "../constants/companies";
import "./AddExperience.css";

const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CHEM",
  "CIVIL",
  "MME",
  "BIOTECH",
];

const AddExperience = () => {
  // You can still get user if you want to show info elsewhere
  const user = useSelector((state) => state.auth.user);
  const [experience, setExperience] = useState({
    company: "",
    batch: "",
    cgpaCutoff: "",
    experienceType: "Intern",
    eligibleBranches: [],
    OT_questions: [""],
    interviewRounds: [{ title: "Round 1", description: "" }],
    other_comments: "",
    jobDescription: "",
    numberOfSelections: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "eligibleBranches") {
      setExperience((prev) => ({
        ...prev,
        eligibleBranches: checked
          ? [...prev.eligibleBranches, value]
          : prev.eligibleBranches.filter((b) => b !== value),
      }));
    } else {
      setExperience((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // OT Questions
  const handleOTQuestionChange = (idx, value) => {
    setExperience((prev) => {
      const updated = [...prev.OT_questions];
      updated[idx] = value;
      return { ...prev, OT_questions: updated };
    });
  };
  const addOTQuestion = () => {
    setExperience((prev) => ({
      ...prev,
      OT_questions: [...prev.OT_questions, ""],
    }));
  };
  const removeOTQuestion = (idx) => {
    setExperience((prev) => ({
      ...prev,
      OT_questions: prev.OT_questions.filter((_, i) => i !== idx),
    }));
  };

  // Interview Rounds
  const handleRoundChange = (idx, field, value) => {
    setExperience((prev) => {
      const updated = [...prev.interviewRounds];
      updated[idx][field] = value;
      return { ...prev, interviewRounds: updated };
    });
  };
  const addRound = () => {
    setExperience((prev) => ({
      ...prev,
      interviewRounds: [
        ...prev.interviewRounds,
        { title: `Round ${prev.interviewRounds.length + 1}`, description: "" },
      ],
    }));
  };
  const removeRound = (idx) => {
    setExperience((prev) => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter((_, i) => i !== idx),
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8000"
        }/api/experiences/addExperience`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // important for cookies/session!
          body: JSON.stringify(experience),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Experience submitted for review!");
        setExperience({
          company: "",
          batch: "",
          cgpaCutoff: "",
          experienceType: "Intern",
          eligibleBranches: [],
          OT_questions: [""],
          interviewRounds: [{ title: "Round 1", description: "" }],
          other_comments: "",
        });
      } else {
        setErrorMessage(data.message || "Submission failed.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="add-exp-form-bg">
      <form className="add-exp-form" onSubmit={handleSubmit}>
        <h2 className="add-exp-title">
          Fill out the form below to add a new experience
        </h2>
        <div className="add-exp-grid">
          <label>Batch</label>
          <input
            type="text"
            name="batch"
            value={experience.batch}
            onChange={handleChange}
            placeholder="2017-2021"
          />

          <label>Company Name</label>
          <select
            name="company"
            value={experience.company}
            onChange={handleChange}
          >
            <option value="">Company Name</option>
            {NAMES.map((name, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
          </select>

          <label>CGPA Cutoff</label>
          <input
            type="text"
            name="cgpaCutoff"
            value={experience.cgpaCutoff}
            onChange={handleChange}
            placeholder="CGPA"
          />

          <label>Experience Type</label>
          <select
            name="experienceType"
            value={experience.experienceType}
            onChange={handleChange}
          >
            <option value="Intern">Intern</option>
            <option value="Placement">Placement</option>
          </select>

          <label>Eligible Branches</label>
          <div className="branches-list">
            {BRANCHES.map((branch) => (
              <label key={branch} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  name="eligibleBranches"
                  value={branch}
                  checked={experience.eligibleBranches.includes(branch)}
                  onChange={handleChange}
                />{" "}
                {branch}
              </label>
            ))}
          </div>
          <label>Job Description</label>
          <textarea
            name="jobDescription"
            value={experience.jobDescription}
            onChange={handleChange}
            placeholder="Job Description"
            style={{ width: "100%" }}
          />

          <label>Number of Selections</label>
          <input
            type="number"
            name="numberOfSelections"
            value={experience.numberOfSelections}
            onChange={handleChange}
            placeholder="Number of Selections"
            min="0"
          />
        </div>

        <div className="add-exp-section">
          <label>Online Test Questions</label>
          {experience.OT_questions.map((q, idx) => (
            <div key={idx} className="add-exp-row-flex">
              <input
                type="text"
                value={q}
                onChange={(e) => handleOTQuestionChange(idx, e.target.value)}
                placeholder={`Question ${idx + 1} of OT`}
                style={{ flex: 1 }}
              />
              {experience.OT_questions.length > 1 && (
                <button
                  type="button"
                  className="add-exp-remove-btn"
                  onClick={() => removeOTQuestion(idx)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-exp-add-btn"
            onClick={addOTQuestion}
          >
            Add OT Question
          </button>
        </div>

        <div className="add-exp-section">
          <label>Interview Rounds</label>
          {experience.interviewRounds.map((round, idx) => (
            <div key={idx} className="add-exp-round">
              <input
                type="text"
                value={round.title}
                onChange={(e) =>
                  handleRoundChange(idx, "title", e.target.value)
                }
                placeholder={`Round ${idx + 1} Title`}
                style={{ marginBottom: 6, width: "100%" }}
              />
              <textarea
                value={round.description}
                onChange={(e) =>
                  handleRoundChange(idx, "description", e.target.value)
                }
                placeholder={`Describe ${round.title || `Round ${idx + 1}`}`}
                style={{ width: "100%" }}
              />
              {experience.interviewRounds.length > 1 && (
                <button
                  type="button"
                  className="add-exp-remove-btn"
                  onClick={() => removeRound(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-exp-add-btn" onClick={addRound}>
            Add Interview Round
          </button>
        </div>

        <div className="add-exp-section">
          <label>Other Remarks/Comments</label>
          <textarea
            name="other_comments"
            value={experience.other_comments}
            onChange={handleChange}
            placeholder="Final Comments"
            style={{ width: "100%" }}
          />
        </div>
        <button type="submit" className="add-exp-submit-btn">
          Submit
        </button>
        {errorMessage && (
          <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p style={{ color: "green", marginTop: 10 }}>{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default AddExperience;
