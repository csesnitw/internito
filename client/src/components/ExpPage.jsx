import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ExpPage.css";

const DropdownSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown-section">
      <button className="dropdown-header" onClick={() => setOpen(!open)}>
        {title} <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="dropdown-content">{children}</div>}
    </div>
  );
};

function autoGrow(e) {
  e.target.style.height = "auto";
  e.target.style.height = e.target.scrollHeight + "px";
}

const ExpPage = () => {
  const { id } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expUser, setExpUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/user/${
          exp.user
        }`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (response.ok){
        setExpUser(data.user);
        setLoading(false);
      } else {
        console.error("Error fetching data:", data.message);
        setError("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch user data");
    }
  };

  // Fetch data based on the ID from the URL
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8000"
        }/api/experiences/specific/${id}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (response.ok){
        setExp(data);
      } else {
        console.error("Error fetching data:", data.message);
        setError("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (exp) {
      fetchUser();
      fetchComments();
    }
  }, [exp]);

  const fetchComments = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/experiences/${id}/comments`,
      { credentials: "include" }
    );
    const data = await response.json();
    if (response.ok) {
      setComments(data);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

const handleCommentSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/experiences/${id}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: newComment }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      setComments([...comments, data.comment]);
      setNewComment("");
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
};

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
        <div className="top-section">
          <div className="left-section">
            <div className="details-section">
              <DropdownSection title="Job Description">
                <p>{exp?.jobDescription}</p>
              </DropdownSection>

              <DropdownSection title="Number of Selections">
                <p>{exp?.numberOfSelections}</p>
              </DropdownSection>
              <DropdownSection title="Online Test Description">
                <p>{exp?.OT_description}</p>
              </DropdownSection>

              <DropdownSection title="Online Test Questions">
                {exp?.OT_questions?.map((q, i) => (
                  <div key={i} className="question-block">
                    <p>{q}</p>
                  </div>
                ))}
              </DropdownSection>

              <DropdownSection title="Interview Rounds">
                {exp?.interviewRounds?.map((round, i) => (
                  <div key={round._id || i} className="round-block">
                    <h3>{round.title}</h3>
                    <p>{round.description}</p>
                  </div>
                ))}
              </DropdownSection>

              <DropdownSection title="Other Comments">
                <p>{exp?.other_comments}</p>
              </DropdownSection>
            </div>
            <div className="comments-section">
            <h2>Comments</h2>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="comment">
                  <strong>{c.user?.firstName} {c.user?.lastName}:</strong>
                  <p>{c.text}</p>
                </div>
              ))
            )}

            <form onSubmit={handleCommentSubmit}>
              <textarea
                name="newComment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                onInput={autoGrow}
                rows={4}
                style={{ width: "100%", minHeight: 150 }}
                required
              />
              <button type="submit">Post</button>
            </form>
          </div>
          </div>
          <div className="right-section">
            <div className="user-card">
              <h1 className="user-title">User Details</h1>
              <p>
                <span className="label">Name:</span> {expUser.firstName}{" "}
                {expUser.lastName}
              </p>

              <p>
                <span className="label">Roll No:</span> {expUser.rollNo}
              </p>
              <p>
                <span className="label">Company:</span> {exp.company}
              </p>
              <p>
                <span className="label">Drive:</span> {exp.experienceType}
              </p>
              <p>
                <span className="label">CGPA cutoff:</span> {exp.cgpaCutoff}
              </p>
              <p>
                <span className="label">Eligible Branches:</span>{" "}
                {exp.eligibleBranches.join(", ")}
              </p>
              {expUser.linkedIn === "" || expUser.linkedIn === undefined ? (
                ""
              ) : (
                <p>
                  <span className="label">LinkedIn: </span> {expUser.linkedIn}
                </p>
              )}

              {expUser.github === "" || expUser.github === undefined ? (
                ""
              ) : (
                <p>
                  <span className="label">GitHub: </span> {expUser.github}
                </p>
              )}
              {expUser.resume === "" || expUser.resume === undefined ? (
                ""
              ) : (
                <p>
                  <span className="label">Resume: </span>{expUser.resume}
                </p>
              )}
            </div>
          </div>
        </div>
          
        </>
      )}
      {error && <p>{error}</p>
      }
    </div>
  );
};

export default ExpPage;
