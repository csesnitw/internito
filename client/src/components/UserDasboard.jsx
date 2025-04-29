import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import './UserDetails.css';
import './Experiences.css'; // For Experiences-specific styles


const UserDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
      // Fetch all experiences submitted by user from the server
      const fetchExperiences = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/${user.username}`,
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

  return (
    
        <div className="dashboard-main">
          <div className="dashboard-left">
            <div className="user-card">
              <h1 className="user-title">User Details</h1>
              <p><span className="label">Name:</span> {user.firstName} {user.lastName}</p>
              <p><span className="label">Email:</span> {user.email}</p>
              <p><span className="label">Roll No:</span> {user.rollNo}</p>
              <p><span className="label">Branch:</span> {user.branch}</p>
              <p><span className="label">Year of Study:</span> {user.yearOfStudy}</p>
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
            <div className="experiences-section">
              <h1>Your Experiences</h1>
              {loading ? (
                <div>Loading...</div>
              ) : (
                <div className="experiences-results">
                  {(!experiences || experiences.length === 0) ? <div>No experiences found.</div> : experiences.map((exp) => (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
};

export default UserDashboard;
