import React, { useState } from "react";

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
    <div className="feedback-container">
      <h2>Send us your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          placeholder="Enter your feedback here..."
          rows={6}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {status && <div className="feedback-status">{status}</div>}
    </div>
  );
};

export default Feedback;