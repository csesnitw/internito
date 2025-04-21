import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { NAMES } from '../constants/companies'; // Import the list of companies

const AddExperience = () => {
  const user = useSelector((state) => state.auth.user);
  const [experience, setExperience] = useState({
    company: "",
    name: "",
    email: user.username,
    batch: "",
    cgpaCutoff: "",
    experienceType: "Intern",
    position: "",
    date: "",
    OT_description: "",
    interview_description: "",
    other_comments: ""
  });
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const [successMessage, setSuccessMessage] = useState(''); // State to store success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperience((prevExperience) => ({
      ...prevExperience,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous error messages
    setSuccessMessage(''); // Clear previous success messages

    try {
      const response = await fetch('http://localhost:8000/experiences/addExperience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experience),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message); // Display success message
        setExperience({
          company: "",
          name: "",
          email: user.username,
          batch: "",
          cgpaCutoff: "",
          experienceType: "Intern",
          position: "",
          date: "",
          OT_description: "",
          interview_description: "",
          other_comments: ""
        });
      } else {
        setErrorMessage(data.message); // Display error message
      }
    } catch (error) {
      console.error('Error submitting experience:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={experience.name}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Batch:
          <input
            type="text"
            name="batch"
            value={experience.batch}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          CGPA Cutoff:
          <input
            type="text"
            name="cgpaCutoff"
            value={experience.cgpaCutoff}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Company:
          <select
            name="company"
            value={experience.company}
            onChange={handleChange}
          >
            <option value="">Select a company</option>
            {NAMES.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Position:
          <input
            type="text"
            name="position"
            value={experience.position}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Experience Type:
          <select
            name="experienceType"
            value={experience.experienceType}
            onChange={handleChange}
          >
            <option value="Intern">Intern</option>
            <option value="Placement">Placement</option>
          </select>
        </label>
        <br />
        <label>
          Online Test Experience:
          <textarea
            name="OT_description"
            type="text"
            value={experience.OT_description}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Interview Experience:
          <textarea
            name="interview_description"
            type="text"
            value={experience.interview_description}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Other Remarks/Comments:
          <textarea
            name="other_comments"
            type="text"
            value={experience.other_comments}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Add Experience</button>
      </form>

      {/* Display Error Message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Display Success Message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default AddExperience;