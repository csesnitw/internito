import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NAMES } from "../constants/companies";
import { VERDICTS } from "../constants/verdictsMap";
import "./AddExperience.css";
import Slider from "@mui/material/Slider";

// Constants
const BRANCHES = [
  "CSE", "MNC", "ECE", "EEE", "Mech", "Chem", "Civil", "MME", "Biotech",
];

const BATCHES = [
  "2017-21", "2018-22", "2019-23", "2020-24", "2021-25", "2022-26",
  "2023-27", "2024-28", "2025-29", "2026-30",
];

const REQUIRED_FIELDS = [
  "batch", "company", "cgpaCutoff", "jobDescription",
  "numberOfSelections", "OT_description", "other_comments",
];

const ROUND_TYPES = ["HR", "Technical", "Project", "Resume", "Mixed"];

// Helper Functions
const autoGrow = (e) => {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
};

// Default form state
const DEFAULT_EXPERIENCE = {
  company: "",
  batch: "",
  cgpaCutoff: "",
  experienceType: "Intern",
  eligibleBranches: [],
  OT_description: "",
  OT_duration: "60",
  OT_questions: [],
  interviewRounds: [{ title: "Round 1", type: "", description: "", duration: "60" }],
  other_comments: "",
  jobDescription: "",
  numberOfSelections: "",
  verdict: undefined,
};

const AddExperience = ({ initialExperience, editMode, experienceId }) => {
  const user = useSelector((state) => state.auth.user);

  // Component state
  const [loading, setLoading] = useState(false);
  const [experience, setExperience] = useState(DEFAULT_EXPERIENCE);
  const [dontRememberSelections, setDontRememberSelections] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (initialExperience) {
      setExperience({ ...DEFAULT_EXPERIENCE, ...initialExperience });
      setDontRememberSelections(initialExperience.numberOfSelections === -1);
    }
  }, [initialExperience]);

  // Validation logic
  const isFieldValid = (name, value) => {
    switch (name) {
      case "cgpaCutoff":
        const cgpa = parseFloat(value);
        return value !== "" && !isNaN(cgpa) && cgpa >= 0 && cgpa <= 10;

      case "numberOfSelections":
        if (dontRememberSelections) return true;
        const selections = parseInt(value, 10);
        return value !== "" && !isNaN(selections) && selections >= 0;

      default:
        if (REQUIRED_FIELDS.includes(name)) {
          return value && value.trim() !== "";
        }
        return true;
    }
  };

  const getInputClass = (name, value) => {
    const baseClass = "add-exp-grid-input";
    if (!submitAttempted) return baseClass;
    return isFieldValid(name, value) ? `${baseClass} valid` : `${baseClass} invalid`;
  };

  const getTextareaClass = (name, value) => {
    const baseClass = "add-exp-grid-textarea";
    if (!submitAttempted) return baseClass;
    return isFieldValid(name, value) ? `${baseClass} valid` : `${baseClass} invalid`;
  };

// Form change handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "eligibleBranches") {
      setExperience((prev) => ({
        ...prev,
        eligibleBranches: checked
          ? [...prev.eligibleBranches, value]
          : prev.eligibleBranches.filter((b) => b !== value),
      }));
    } else if (name === "dontRememberSelections") {
      setDontRememberSelections(checked);
      setExperience((prev) => ({
        ...prev,
        numberOfSelections: checked ? "-1" : "",
      }));
    } else if (name === "verdict") {
      setExperience((prev) => ({
        ...prev,
        verdict: value === "" ? undefined : value,
      }));
    } else {
      setExperience((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // OT Questions handlers
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

  // Interview Rounds handlers
  const handleRoundChange = (idx, field, value) => {
    setExperience((prev) => {
      const updated = prev.interviewRounds.map((round, i) =>
        i === idx ? { ...round, [field]: value } : round
      );
      return { ...prev, interviewRounds: updated };
    });
  };

  const addRound = () => {
    setExperience((prev) => ({
      ...prev,
      interviewRounds: [
        ...prev.interviewRounds,
        { title: `Round ${prev.interviewRounds.length + 1}`, type: "", description: "", duration: "60" },
      ],
    }));
  };

  const removeRound = (idx) => {
    setExperience((prev) => ({
      ...prev,
      interviewRounds: prev.interviewRounds.filter((_, i) => i !== idx),
    }));
  };

  const printRoundDuration = (a) => {
    let s = "";
    const hours = Math.trunc(a / 60);
    const minutes = a % 60;
    if (hours > 0) {
      s += `${hours}h`;
    }
    if (minutes > 0) {
      if (s !== "") {
        s += " ";
      }
      s += `${minutes}m`;
    }
    if (a === 0) {
      s = "0m";
    }
    return s;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSubmitAttempted(true);
    setLoading(true);

    const setValidationError = (message) => {
      setErrorMessage(message);
      setLoading(false);
    };

    // Required field validation
    const validationChecks = [
      { condition: !experience.company.trim(), message: "Company name is required." },
      { condition: !experience.batch, message: "Batch selection is required." },
      { condition: !experience.cgpaCutoff || experience.cgpaCutoff < 0 || experience.cgpaCutoff > 10, message: "Please enter a valid CGPA between 0-10." },
      { condition: !experience.jobDescription.trim(), message: "Job description is required." },
      { condition: !experience.OT_description.trim(), message: "Online test description is required." },
      { condition: !experience.other_comments.trim(), message: "Comments section is required." },
      { condition: !dontRememberSelections && (!experience.numberOfSelections || experience.numberOfSelections < 0), message: "Please enter a valid number of selections." },
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        setValidationError(check.message);
        return;
      }
    }

    if (experience.OT_questions.some(q => q.trim() === "")) {
      setValidationError("Please fill in all OT questions or remove empty ones.");
      return;
    }

    for (let i = 0; i < experience.interviewRounds.length; i++) {
      const round = experience.interviewRounds[i];
      if (!round.title.trim() || !round.type.trim() || !round.description.trim()) {
        setValidationError(`Please complete all fields for Round ${i + 1}.`);
        return;
      }
    }

    const payload = {
      company: experience.company.trim(),
      batch: experience.batch.trim(),
      cgpaCutoff: parseFloat(experience.cgpaCutoff) || 0,
      experienceType: experience.experienceType || "Intern",
      eligibleBranches: experience.eligibleBranches.length ? experience.eligibleBranches : ["CSE"],
      OT_description: experience.OT_description.trim(),
      OT_duration: experience.OT_duration,
      OT_questions: experience.OT_questions.map(q => q.trim()).filter(q => q !== ""),
      interviewRounds: experience.interviewRounds.map((round, idx) => ({
        title: round.title.trim() || `Round ${idx + 1}`,
        type: round.type.trim(),
        description: round.description.trim(),
        duration: round.duration,
      })),
      other_comments: experience.other_comments.trim(),
      jobDescription: experience.jobDescription.trim(),
      numberOfSelections: dontRememberSelections ? -1 : parseInt(experience.numberOfSelections) || 0,
      verdict: experience.verdict,
    };

    try {
      let response, data;
      if (editMode && experienceId) {
        response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/experiences/edit/${experienceId}`,
          { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) }
        );
        data = await response.json();
        if (response.ok) setSuccessMessage("Experience updated successfully!");
        else setErrorMessage(data.message || "Update failed.");
      } else {
        response = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/experiences/addExperience`,
          { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) }
        );
        data = await response.json();
        if (response.ok) {
          setSuccessMessage("Thank you! Experience submitted for review.");
          setExperience(DEFAULT_EXPERIENCE);
          setDontRememberSelections(false);
          setSubmitAttempted(false);
        } else setErrorMessage(data.message || "Submission failed.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="add-exp-form-bg">
      <h2 className="add-exp-title">
        {editMode ? <>Edit <span className="add-exp-title-green">Experience</span></> :
          <>Fill out the form below to add a <span className="add-exp-title-green">new experience</span></>}
      </h2>
      <form className="add-exp-form" onSubmit={handleSubmit}>
        <div className="about-highlight">
          Keep your experiences relevant and avoid overly negative rants.
        </div>

        {/* Batches, Company, CGPA, Type, Branches */}
        <div className="add-exp-grid">
          <label>Batch</label>
          <select name="batch" value={experience.batch} onChange={handleChange} className={getInputClass("batch", experience.batch)}>
            <option value="">Select Batch</option>
            {BATCHES.map((batch) => <option key={batch} value={batch}>{batch}</option>)}
          </select>

          <label>Company Name</label>
          <input
            type="text"
            name="company"
            placeholder="Type your company"
            value={experience.company}
            onChange={handleChange}
            className={getInputClass("company", experience.company)}
            list="company-list"
          />
          <datalist id="company-list">
            {NAMES.map((name, idx) => <option key={idx} value={name} />)}
          </datalist>

          <label>CGPA Cutoff</label>
          <input type="number" name="cgpaCutoff" value={experience.cgpaCutoff} onChange={handleChange}
            placeholder="CGPA" min="0" max="10" step="0.01"
            className={getInputClass("cgpaCutoff", experience.cgpaCutoff)} />

          <label>Experience Type</label>
          <select name="experienceType" value={experience.experienceType} onChange={handleChange} className="add-exp-grid-input">
            <option value="Intern">Intern</option>
            <option value="Placement">Placement</option>
          </select>

          <label>Eligible Branches</label>
          <div className="branches-list">
            {BRANCHES.map((branch) => (
              <label key={branch} className="modern-checkbox-label">
                <input type="checkbox" name="eligibleBranches" value={branch}
                  checked={experience.eligibleBranches.includes(branch)} onChange={handleChange} className="modern-checkbox" />
                <span className="modern-checkbox-custom" />
                <span className="modern-checkbox-text">{branch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Number of selections */}
        <div className="add-exp-grid add-exp-grid-row">
          <label>Number of Selections</label>
          <input
            type="number"
            name="numberOfSelections"
            value={dontRememberSelections ? "" : experience.numberOfSelections}
            onChange={handleChange}
            placeholder="Number of Selections"
            min="0"
            className={`add-exp-grid-input ${getInputClass("numberOfSelections", experience.numberOfSelections)}`}
            disabled={dontRememberSelections}
          />
          {/* --- FIX STARTS HERE --- */}
          <label className="modern-checkbox-label">
            <input
              type="checkbox"
              name="dontRememberSelections"
              checked={dontRememberSelections}
              onChange={handleChange}
              className="modern-checkbox"
            />
            <span className="modern-checkbox-custom" />
            <span className="modern-checkbox-text">Don't Remember</span>
          </label>
          {/* --- FIX ENDS HERE --- */}

          <label>Verdict (Optional)</label>
          <select
            name="verdict"
            value={experience.verdict || ""}
            onChange={handleChange}
            className={getInputClass("verdict", experience.verdict)}
          >
            <option value="">Select verdict</option>
            {VERDICTS.map((verdict) => (
              <option key={verdict.value} value={verdict.value}>
                {verdict.label}
              </option>
            ))}
          </select>
        </div>

        <div className="add-exp-round">
          <label>Online Test Description</label>
          <textarea
            name="OT_description"
            value={experience.OT_description}
            onChange={handleChange}
            placeholder="Describe the Online Test (pattern, difficulty, etc.)"
            className={getTextareaClass(
              "OT_description",
              experience.OT_description
            )}
            onInput={autoGrow}
            rows={4}
            style={{ width: "100%", minHeight: 150 }}
          />
          <label>OT Duration:</label>
          <Slider
            value={Number(experience.OT_duration)}
            onChange={(e, newValue) =>
              handleChange({
                target: { name: "OT_duration", value: newValue },
              })
            }
            min={0}
            max={180}
            step={10}
            sx={{
              width: "50%",
              "& .MuiSlider-track": {
                backgroundColor: "#76b852",
                border: "none",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#76b852",
              },
              "& .MuiSlider-thumb": {
                backgroundColor: "#76b852",
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "0 0 0 8px rgba(118, 184, 82, 0.3)",
                },
              },
            }}
          />
          {printRoundDuration(Number(experience.OT_duration))}
        </div>

        {/* OT Questions */}
        <div className="add-exp-section">
          <label>Online Test Questions</label>
          <div className="add-exp-ot-questions-list">
            {experience.OT_questions.map((q, idx) => (
              <div
                key={idx}
                className={`add-exp-ot-question-card ${submitAttempted ? (q.trim() ? "valid" : "invalid") : ""
                  }`}
              >
                <input
                  type="text"
                  value={q}
                  onChange={(e) => handleOTQuestionChange(idx, e.target.value)}
                  placeholder={`Question ${idx + 1} of OT`}
                  className="plain-input"
                />
                <button
                  type="button"
                  className="add-exp-remove-btn"
                  onClick={() => removeOTQuestion(idx)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="add-exp-add-btn" onClick={addOTQuestion}>
            + Add OT Question
          </button>
        </div>


        {/* Interview Rounds */}
        <div className="add-exp-section">
          <label>Interview Rounds</label>
          {experience.interviewRounds.map((round, idx) => {
            const isRoundValid = round.title && round.type && round.description;
            const roundClass = `add-exp-round${submitAttempted ? (isRoundValid ? " valid" : " invalid") : ""
              }`;

            return (
              <div key={idx} className={roundClass}>
                <input
                  type="text"
                  value={round.title}
                  onChange={(e) => handleRoundChange(idx, "title", e.target.value)}
                  placeholder={`Round ${idx + 1} Title`}
                  className="plain-input"
                />

                <div className="round-type-options">
                  {ROUND_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`round-type-pill ${round.type === type ? "selected" : ""}`}
                      onClick={() => handleRoundChange(idx, "type", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <textarea
                  value={round.description}
                  onChange={(e) => handleRoundChange(idx, "description", e.target.value)}
                  placeholder={`Describe ${round.title || `Round ${idx + 1}`}`}
                  className="plain-textarea"
                  onInput={autoGrow}
                  rows={4}
                />

                <label>Round Duration:</label>
                <Slider
                  value={Number(round.duration)}
                  onChange={(e, newValue) => handleRoundChange(idx, "duration", newValue)}
                  min={0}
                  max={180}
                  step={10}
                  sx={{
                    width: "50%",
                    "& .MuiSlider-track": {
                      backgroundColor: "#76b852",
                      border: "none",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#76b852",
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#76b852",
                      "&:hover, &.Mui-focusVisible, &.Mui-active": {
                        boxShadow: "0 0 0 8px rgba(118, 184, 82, 0.3)",
                      },
                    },
                  }}
                />
                {printRoundDuration(Number(round.duration))}
                {experience.interviewRounds.length > 1 && (
                  <button
                    type="button"
                    className="add-exp-remove-btn"
                    onClick={() => removeRound(idx)}
                    aria-label={`Remove Round ${idx + 1}`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            className="add-exp-add-btn"
            onClick={addRound}
          >
            + Add Interview Round
          </button>
        </div>
        
        <div className="add-exp-section">
          <label>Job Description</label>
          <textarea name="jobDescription" value={experience.jobDescription} onChange={handleChange}
            placeholder="Describe the job role and responsibilities" className={getTextareaClass("jobDescription", experience.jobDescription)}
            onInput={autoGrow} rows={4} style={{ width: "100%", minHeight: 130 }} />
        </div>

        {/* Other Comments */}
        <div className="add-exp-section">
          <label>Other Remarks/Comments</label>
          <textarea name="other_comments" value={experience.other_comments} onChange={handleChange}
            placeholder="Final Comments" className={getTextareaClass("other_comments", experience.other_comments)}
            onInput={autoGrow} rows={4} style={{ width: "100%", minHeight: 130 }} />
        </div>

        <button type="submit" className="add-exp-submit-btn" disabled={loading}>
          {loading ? (editMode ? "Saving..." : "Submitting...") : (editMode ? "Save Changes" : "Submit")}
        </button>

        {(errorMessage || successMessage) && (
          <div className={`feedback-status ${successMessage ? "success" : "error"}`} style={{ marginTop: 10 }}>
            {successMessage || errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddExperience;