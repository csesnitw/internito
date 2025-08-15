import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, setUser } from "../slices/authSlice";
import styles from "./UserDetails.module.css";
import { useNavigate } from "react-router-dom";
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
    // eslint-disable-next-line
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

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?"))
      return;
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:8000"
        }/api/experiences/delete/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (response.ok) {
        setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      } else {
        alert("Failed to delete experience.");
      }
    } catch (err) {
      alert("Error deleting experience.");
    }
  };

  const handleEditExperience = (exp) => {
    navigate(`/editExperience/${exp._id}`, { state: { exp } });
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
        dispatch(setUser(data.user)); // Store user details in Redux
        setSuccessMessage(
          "User details updated successfully! Please login again to view changes."
        );
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
    <div className={styles["dashboard-main"]}>
      <div className={styles["dashboard-left"]}>
        <div className={styles["user-card"]}>
          <h1 className={styles["user-title"]}>User Details</h1>
          <p>
            <span className={styles.label}>Name:</span> {user.firstName}{" "}
            {user.lastName}
          </p>
          <p>
            <span className={styles.label}>Email:</span> {user.email}
          </p>
          <p>
            <span className={styles.label}>Roll No:</span> {user.rollNo}
          </p>
          <p>
            <span className={styles.label}>Branch:</span> {user.branch}
          </p>
          <p>
            <span className={styles.label}>Year of Enrollment:</span>{" "}
            {user.rollNo.slice(0,2)}
          </p>
          <p>
            <span className={styles.label}>LinkedIn:</span>{" "}
            {user.linkedIn === "" || user.linkedIn === undefined
              ? "-"
              : user.linkedIn}
          </p>
          <p>
            <span className={styles.label}>GitHub:</span>{" "}
            {user.github === "" || user.github === undefined
              ? "-"
              : user.github}
          </p>
          <p>
            <span className={styles.label}>Resume:</span>{" "}
            {user.resume === "" || user.resume === undefined
              ? "-"
              : user.resume}
          </p>
          <button
            className={styles["read-more-btn"]}
            onClick={handleModifyDetails}
          >
            Modify Details
          </button>
        </div>

        <div className={styles["write-new-card"]}>
          <div className={styles["user-title"]}>Have something to write?</div>
          <div className="card-text">Share your interview experience</div>
          <button
            className={styles["read-more-btn"]}
            onClick={() => navigate("/addExperiences")}
          >
            Write Now!!
          </button>
        </div>
      </div>

      <div className={styles["dashboard-right"]}>
        {!ModClicked ? (
          <div className={styles["experiences-section"]}>
            <h1>Your Experiences</h1>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className={styles["experiences-results"]}>
                {!experiences || experiences.length === 0 ? (
                  <div>No experiences found.</div>
                ) : (
                  experiences.map((exp) => (
                    <div
                      key={exp._id}
                      className={`${styles["result-card"]} ${styles["experiences-card"]}`}
                    >
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
                        className={styles["read-more-btn"]}
                        onClick={() => navigate(`/experiences/${exp._id}`)}
                      >
                        Read More
                      </button>
                      <button
                        className={styles["edit-btn"]}
                        onClick={() => handleEditExperience(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles["delete-btn"]}
                        onClick={() => handleDeleteExperience(exp._id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className={styles["experiences-section"]}>
            <h1>Modify your details</h1>
            <form onSubmit={handleSubmit} className={styles["add-exp-form"]}>
              <h2 className={styles["add-exp-title"]}>Enter your Links</h2>
              <div className={styles["add-exp-grid"]}>
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

              <button type="submit" className={styles["add-exp-submit-btn"]}>
                Submit
              </button>
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
