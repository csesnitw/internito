import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function Experiences() {
  const user = useSelector((state) => state.auth.user); // Get user details from Redux
  const [experiences, setExperiences] = useState([]); // State to store experiences

  // Fetch experiences from the backend
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences`,
          {
            credentials: 'include',
          }
        );
        const data = await response.json();
        setExperiences(data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <div>
      <h1>Experiences Page</h1>
      {user && <h2>Hello, {user.username}</h2>} {/* Display username */}

      {/* Display Experiences */}
      <div>
        {experiences.map((exp) => (
          <div key={exp._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
            <h3>{exp.company}</h3>
            <p><strong>Position:</strong> {exp.position}</p>
            <p><strong>CGPA Cutoff:</strong> {exp.cgpaCutoff}</p>
            <p><strong>Batch:</strong> {exp.batch}</p>
            <p><strong>Experience Type:</strong> {exp.experienceType}</p>
            <p><strong>Online Test:</strong> {exp.OT_description}</p>
            <p><strong>Interview:</strong> {exp.interview_description}</p>
            <p><strong>Other Comments:</strong> {exp.other_comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Experiences;