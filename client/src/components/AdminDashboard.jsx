import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Experiences.css'; // For Experiences-specific styles

const AdminDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.username !== "dv22csb0f38") { //change this later
      // Redirect to home page if not admin
      navigate("/");
    }
    // Fetch all experiences from the server
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/pending`,
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

  const handleDecision = async (id, decision) => {
    try {
      if (decision === "rejected") {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/delete/${id}`, {
          method: "DELETE",
        });
      } else {
        await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/verify/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: decision }),
        });
      }

      // Update the state to remove the processed experience
      setExperiences((prevExperiences) =>
        prevExperiences.filter((experience) => experience._id !== id)
      );
    } catch (error) {
      console.error("Error updating experience status:", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="experiences-results">
          {experiences.map((exp) => (
            <div key={exp._id} className="result-card experiences-card">
              <div className="card-desc">
                {exp.OT_description?.slice(0, 180) || ''}...
              </div>
              <div className="card-name">
                {exp.name}
              </div>
              <div className="card-company">
                interview experience of <span style={{ fontWeight: 600 }}>{exp.company?.toLowerCase()}</span>
              </div>
              <button
                className="read-more-btn"
                onClick={() => navigate(`/admin/experiences/${exp._id}`)}
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
