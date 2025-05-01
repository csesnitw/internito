import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
          }/api/experiences/${UserCopy.username}`,
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
    setChanged(true);
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
      if (response.ok) {
        setSuccessMessage("User details updated successfully!");
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to update user details. Please try again.");
        setSuccessMessage("");
      }
    } catch (error) {
      //setUserCopy(user);
      setErrorMessage("Failed to update user details. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-left">
        <div className="user-card">
          <h1 className="user-title">User Details</h1>
          <p>
            <span className="label">Name:</span> {UserCopy.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className="label">Email:</span> {UserCopy.email}
          </p>
          <p>
            <span className="label">Roll No:</span> {UserCopy.rollNo}
          </p>
          <p>
            <span className="label">Branch:</span> {UserCopy.branch}
          </p>
          <p>
            <span className="label">Year of Study:</span> {UserCopy.yearOfStudy}
          </p>
          <p>
            <span className="label">LinkedIn:</span>{" "}
            {UserCopy.linkedIn === "" || UserCopy.linkedIn === undefined
              ? "-"
              : UserCopy.linkedIn}
          </p>
          <p>
            <span className="label">GitHub:</span>{" "}
            {UserCopy.github === "" || UserCopy.github === undefined
              ? "-"
              : UserCopy.github}
          </p>
          <p>
            <span className="label">Resume:</span>{" "}
            {UserCopy.resume === "" || UserCopy.resume === undefined
              ? "-"
              : UserCopy.resume}
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
            <form onSubmit={handleSubmit} className="profile-links-form">
              <h2>Enter Your Links</h2>

              <label>
                LinkedIn:
                <input
                  type="url"
                  name="linkedIn"
                  value={UserCopy.linkedIn}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                />
              </label>

              <label>
                GitHub:
                <input
                  type="url"
                  name="github"
                  value={UserCopy.github}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                />
              </label>

              <label>
                Resume Link:
                <input
                  type="url"
                  name="resume"
                  value={UserCopy.resume}
                  onChange={handleChange}
                  placeholder="https://yourdomain.com/resume.pdf"
                />
              </label>

              <button type="submit">Submit</button>
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
