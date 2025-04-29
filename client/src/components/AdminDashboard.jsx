import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.username !== "dv22csb0f38") { //change this later
      // Redirect to home page if not admin
      navigate("/");
    }
    // Fetch all experiences from the server
    const fetchExperiences = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/pending`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setExperiences(data);
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
      <ul>
        {experiences.map((experience) => (
          <li key={experience._id}>
            <p>
              {experience.company} - {experience.position}
            </p>
            <button onClick={() => handleDecision(experience._id, "Accepted")}>
              Accept
            </button>
            <button onClick={() => handleDecision(experience._id, "Rejected")}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
