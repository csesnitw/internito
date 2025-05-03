import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { login, setUser } from '../slices/authSlice';

import { useNavigate } from "react-router-dom";
import "./UserDetails.css";
import "./Experiences.css"; // For Experiences-specific styles

const UserDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const [ModClicked, setModClicked] = useState(false);
  const [changed, setChanged] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [UserCopy, setUserCopy] = useState(user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setUserCopy(user);
    setModClicked(false);
    setChanged(false);
    // Fetch all experiences submitted by user from the server
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/api/experiences/user/${UserCopy._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setExperiences(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };
    fetchExperiences();
  }, []);

  const handleChange = (e) => {
    if (!changed) setChanged(true);
    const { name, value } = e.target;
    setUserCopy((prev) => ({ ...prev, [name]: value }));
  };
  const handleModifyDetails = () => {
    setChanged(false);
    setErrorMessage("");
    setSuccessMessage("");
    setModClicked((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!changed) {
      setErrorMessage("No changes made to update.");
      setSuccessMessage("");
      return;
    }
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8000"
        }/api/user/modify/${UserCopy._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            linkedIn: UserCopy.linkedIn,
            github: UserCopy.github,
            resume: UserCopy.resume,
          }),
        }
      );

      const data = await response.json();
      console.log(data.user)
      if (response.ok) {
        dispatch(setUser(data.user)); // Store user details in Redux
        setSuccessMessage("User details updated successfully! Please login again to view changes.");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to update user details. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-left">
        <div className="user-card">
          <h1 className="user-title">User Details</h1>
          <p>
            <span className="label">Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className="label">Email:</span> {user.email}
          </p>
          <p>
            <span className="label">Roll No:</span> {user.rollNo}
          </p>
          <p>
            <span className="label">Branch:</span> {user.branch}
          </p>
          <p>
            <span className="label">Year of Study:</span> {user.yearOfStudy}
          </p>
          <p>
            <span className="label">LinkedIn:</span>{" "}
            {user.linkedIn === "" || user.linkedIn === undefined
              ? "-"
              : user.linkedIn}
          </p>
          <p>
            <span className="label">GitHub:</span>{" "}
            {user.github === "" || user.github === undefined
              ? "-"
              : user.github}
          </p>
          <p>
            <span className="label">Resume:</span>{" "}
            {user.resume === "" || user.resume === undefined
              ? "-"
              : user.resume}
          </p>
          <button className="read-more-btn" onClick={handleModifyDetails}>
            Modify Details
          </button>
        </div>

        <div className="write-new-card">
          <div className="user-title">Have something to write?</div>
          <div className="card-text">Share your interview experience</div>
          <button
            className="read-more-btn"
            onClick={() => navigate("/addExperiences")}
          >
            Write Now!!
          </button>
        </div>
      </div>

      <div className="dashboard-right">
        {!ModClicked ? (
          <div className="experiences-section">
            <h1>Your Experiences</h1>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="experiences-results">
                {!experiences || experiences.length === 0 ? (
                  <div>No experiences found.</div>
                ) : (
                  experiences.map((exp) => (
                    <div key={exp._id} className="result-card experiences-card">
                      <div className="card-desc">
                        {exp.OT_description?.slice(0, 180) || ""}...
                      </div>
                      <div className="card-name">{exp.name}</div>
                      <div className="card-company">
                        interview experience of{" "}
                        <span style={{ fontWeight: 600 }}>
                          {exp.company?.toLowerCase()}
                        </span>
                      </div>
                      <button
                        className="read-more-btn"
                        onClick={() => navigate(`/experiences/${exp._id}`)}
                      >
                        Read More
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="experiences-section">
            <h1>Modify your details</h1>
            <form onSubmit={handleSubmit} className="add-exp-form">
              <h2 className="add-exp-title">Enter your Links</h2>
              <div className="add-exp-grid">
                <label>LinkedIn</label>
                <input
                  type="url"
                  name="linkedIn"
                  value={UserCopy.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                />

                <label>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={UserCopy.github}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                />

                <label>Resume Link</label>
                <input
                  type="url"
                  name="resume"
                  value={UserCopy.resume}
                  onChange={handleChange}
                  placeholder="https://yourdomain.com/resume.pdf"
                />
              </div>

              <button type="submit" className="add-exp-submit-btn">Submit</button>
            </form>
            {errorMessage && (
              <p style={{ color: "red", marginTop: 10 }}>{errorMessage}</p>
            )}
            {successMessage && (
              <p style={{ color: "green", marginTop: 10 }}>{successMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
