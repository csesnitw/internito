import React, { useState } from "react";
import "./Feedback.css";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // <-- loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true); // Start loading
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
    setLoading(false); // Stop loading
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
          disabled={loading}
        />
        <button className="feedback-submit" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        {loading && (
          <div className="feedback-loading" style={{ textAlign: "center", marginTop: 8 }}>
            <span className="spinner" style={{
              display: "inline-block",
              width: 22,
              height: 22,
              border: "3px solid #76b852",
              borderTop: "3px solid #eafbe7",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        )}
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
      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default Feedback;