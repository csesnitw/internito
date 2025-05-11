import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import AddExperience from "./AddExperience";

const EditExperience = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [initialExperience, setInitialExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.exp) {
      setInitialExperience(location.state.exp);
      setLoading(false);
    } else {
      fetch(
        `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/api/experiences/specific/${id}`,
        { credentials: "include" }
      )
        .then((res) => res.json())
        .then((data) => {
          setInitialExperience(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, location.state]);

  if (loading) return <div>Loading...</div>;
  if (!initialExperience) return <div>Experience not found.</div>;

  return (
    <AddExperience
      initialExperience={initialExperience}
      editMode={true}
      experienceId={id}
    />
  );
};

export default EditExperience;