import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { NAMES } from "../constants/companies";
import { VERDICTS } from "../constants/verdictsMap";
import "./AddExperience.css";
import Slider from "@mui/material/Slider";
import { useRef} from "react";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";
import parserHTML from "prettier/parser-html";

//Constants
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
  const getDefaultExperience = () => JSON.parse(JSON.stringify(DEFAULT_EXPERIENCE));
  const [experience, setExperience] = useState(getDefaultExperience());
  const [dontRememberSelections, setDontRememberSelections] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const debounceTimers = useRef({});

  // Autofill if editing
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

  // OT Questions
  const handleOTQuestionChange = (idx, field, value) => {
    setExperience((prev) => {
      const updated = [...prev.OT_questions];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, OT_questions: updated };
    });
  };
  const addOTQuestion = () => {
    setExperience((prev) => ({
      ...prev,
      OT_questions: [...prev.OT_questions, { question: "", solutionText: "", solutionCode: "", language: "C++", references: "" }],
    }));
  };
  const removeOTQuestion = (idx) => {
    setExperience((prev) => ({
      ...prev,
      OT_questions: prev.OT_questions.filter((_, i) => i !== idx),
    }));
  };
  const detectLanguage = (code) => {
    if (!code) return null;
    const lower = code.toLowerCase();
    if (lower.includes("#include") || lower.includes("std::")) return "C++";
    if (lower.includes("public static void main")) return "Java";
    if (lower.includes("def ") || lower.includes("import ")) return "Python";
    if (lower.includes("function") || lower.includes("console.log")) return "JavaScript";
    if (lower.includes("typescript") || lower.includes(": number") || lower.includes(": string")) return "TypeScript";

    return null; 
  };
  const formatCode = async (code, language) => {
    try {
      if (!code) return code;

      // Frontend formatting for web languages
      if (language === "JavaScript" || language === "JS") {
        return prettier.format(code, {
          parser: "babel",
          plugins: [parserBabel],
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
        });
      }

      if (language === "TypeScript") {
        return prettier.format(code, {
          parser: "typescript",
          plugins: [parserTypescript],
          semi: true,
          singleQuote: false,
          tabWidth: 2,
          useTabs: false,
        });
      }

      try {
        const res = await fetch("/format", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, language }),
        });
        if (!res.ok) {
          console.warn("Formatter backend returned non-OK status");
          return code;
        }
        const data = await res.json();
        return data.formatted ?? code;
      } catch (err) {
        console.warn("Formatter backend call failed:", err);
        return code;
      }
    } catch (err) {
      console.error("formatCode error:", err);
      return code;
    }
  };

  // Interview Rounds
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

  // Validation for OT Questions and Interview Rounds
  const isOTQuestionsValid =
    experience.OT_questions.every((q) => !q.question || q.question.trim() !== "");
    
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

    if (experience.OT_questions.some(q => q.question.trim() === "")) {
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
      OT_questions: experience.OT_questions.map(q => ({
        question: q.question.trim(),
        solutionText: q.solutionText.trim(),
        solutionCode: q.solutionCode.trim(),
        language: q.language,
        references: q.references.trim(),
      })).filter(q => q.question !== ""),
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
          setExperience(getDefaultExperience());
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
            {experience.OT_questions.map((q, idx) => {
              const isValid = q.question.trim() !== "";
              return (
                <div
                  key={idx}
                  className={
                    "add-exp-ot-question-card" +
                    (submitAttempted ? (isValid ? " valid" : " invalid") : "")
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    width: "100%",
                    boxSizing: "border-box"
                  }}
                >
                  {/* Question */}
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => handleOTQuestionChange(idx, "question", e.target.value)}
                    placeholder={`Question ${idx + 1} of OT`}
                    className="plain-input"
                  />

                  <hr className="add-exp-round-divider" />

                  {/* Solution Section */}
                  <input
                    type="text"
                    value={q.solutionText}
                    onChange={(e) => handleOTQuestionChange(idx, "solutionText", e.target.value)}
                    placeholder="Brief solution / explanation"
                    className="plain-input"
                  />

                  {/* Language Selector + Code Area */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {/* Language Selector (replace your existing select) */}
                    <select
                      value={q.language}
                      onChange={(e) => {
                        const newLang = e.target.value;

                        // 🔹 Reset code when changing language manually
                        handleOTQuestionChange(idx, "language", newLang);
                        handleOTQuestionChange(idx, "solutionCode", "");
                      }}
                      className="plain-input"
                      style={{ width: "150px" }}
                    >
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                      <option value="Python">Python</option>
                      <option value="JavaScript">JavaScript</option>
                      <option value="TypeScript">TypeScript</option>
                    </select>
                    {/* Solution Code Input */}
                    <textarea
                      value={q.solutionCode}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        handleOTQuestionChange(idx, "solutionCode", newValue);

                        // 🔹 Auto-detect language from keywords
                        const detected = detectLanguage(newValue);
                        if (detected && detected !== q.language) {
                          handleOTQuestionChange(idx, "language", detected);
                        }

                        // Debounce formatting
                        if (debounceTimers.current[idx]) {
                          clearTimeout(debounceTimers.current[idx]);
                        }
                        debounceTimers.current[idx] = setTimeout(async () => {
                          const formatted = await formatCode(newValue, q.language);
                          if (formatted !== newValue) {
                            handleOTQuestionChange(idx, "solutionCode", formatted);
                          }
                        }, 800);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const start = e.target.selectionStart;
                          const end = e.target.selectionEnd;
                          const value = e.target.value;
                          const indent = "  "; 
                          e.target.value = value.substring(0, start) + indent + value.substring(end);
                          e.target.selectionStart = e.target.selectionEnd = start + indent.length;
                          handleOTQuestionChange(idx, "solutionCode", e.target.value);
                        }
                      }}
                      placeholder="Write solution code here..."
                      className="plain-textarea code-box"
                      rows={6}
                    />
                  </div>
                  <hr className="add-exp-round-divider" />

                  {/* References (Optional) */}
                  <input
                    type="text"
                    value={q.references}
                    onChange={(e) => handleOTQuestionChange(idx, "references", e.target.value)}
                    placeholder="References (optional)"
                    className="plain-input"
                  />

                  <button
                    type="button"
                    className="add-exp-remove-btn"
                    onClick={() => removeOTQuestion(idx)}
                    aria-label="Remove question"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          <button
            type="button"
            className="add-exp-add-btn"
            onClick={addOTQuestion}
            style={{ marginTop: 8 }}
          >
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