import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

const AddExperience = () => {
    const dispatch = useDispatch();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperience((prevExperience) => ({
      ...prevExperience,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(experience);
    try {
        fetch('http://localhost:8000/experiences/addExperience', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experience),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } catch (error) {
        console.log(error)
    }
    setExperience({
        company: "",
        name: "",
        batch: "",
        cgpaCutoff: "",
        experienceType: "Intern",
        email: user.username,
        position: "",
        date: "",
        OT_description: "",
        interview_description: "",
        other_comments: ""
    });
  };

  return (
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
        <input
          type="text"
          name="company"
          value={experience.company}
          onChange={handleChange}
        />
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
          <option value="Intern" selected>Intern</option>
          <option value="Placement">Placement</option>
        </select>
      </label>
      <br />
      <label>
        Online Test Experience:
        <textarea
          name="OT_description"
          type= "text"
          value={experience.OT_description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Interview Experience:
        <textarea
          name="interview_description"
          type= "text"
          value={experience.interview_description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Other Remarks/Comments:
        <textarea
          name="other_comments"
          type= "text"
          value={experience.other_comments}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Add Experience</button>
    </form>
  );
};

export default AddExperience;
