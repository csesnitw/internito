import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ feedback }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setStatus("Thank you for your feedback!");
        setFeedback("");
      } else {
        setStatus(data.message || "Failed to send feedback.");
      }
    } catch {
      setStatus("Failed to send feedback.");
    }
  };

  return (
    <div className="feedback-bg">
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h2 className="feedback-title">We value your feedback!</h2>
        <p className="feedback-desc">
          Please let us know your thoughts, suggestions, or issues below.
        </p>
        <textarea
          className="feedback-textarea"
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          rows={6}
          required
        />
        <button className="feedback-submit" type="submit">
          Submit
        </button>
        {status && (
          <div
            className={`feedback-status ${
              status.toLowerCase().includes("thank") ? "success" : "error"
            }`}
          >
            {status}
          </div>
        )}
      </form>
    </div>
  );
};

export default Feedback;