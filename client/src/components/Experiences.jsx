import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";
import "./Experiences.css";

function Experiences() {
  const user = useSelector((state) => state.auth.user);
  const [experiences, setExperiences] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        if (sortBy === "recent") {
          const response = await fetch(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:8000"
            }/api/experiences`,
            { credentials: "include" }
          );
          const data = await response.json();
          setExperiences(data);
          setGrouped({});
        } else {
          const response = await fetch(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:8000"
            }/api/experiences/company`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({}),
            }
          );
          const data = await response.json();
          setGrouped(data);
          setExperiences([]);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, [sortBy]);

  // Count for current responses
  const currentCount =
    sortBy === "recent"
      ? experiences.length
      : Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="exp-page" style={{}}>
      <h1
        className="main-search-title"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        All Interview <span>Experiences</span>
      </h1>
      <div className="experiences-toolbar">
        <button
          className={`sort-btn${sortBy === "company" ? " active" : ""}`}
          onClick={() => setSortBy("company")}
        >
          Group by Company
        </button>
        <button
          className={`sort-btn${sortBy === "recent" ? " active" : ""}`}
          onClick={() => setSortBy("recent")}
        >
          Sort by Recent
        </button>
      </div>
      <div className="experiences-count-box">
        <span className="experiences-count-label">Current Responses</span>
        <span className="experiences-count-value">{currentCount}</span>
      </div>
      {loading ? (
        <div className="experiences-loading">Loading...</div>
      ) : sortBy === "recent" ? (
        <div className="experiences-results experiences-results-left">
          {experiences.map((exp) => (
            <div key={exp._id} className="result-card experiences-card">
              <div className="card-desc">
                {exp.OT_description?.slice(0, 180) || ""}...
              </div>
              <div className="card-name">{exp.name}</div>
              <div className="card-company">
                Interview experience of{" "}
                <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
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
      ) : (
        Object.keys(grouped).length > 0 &&
        Object.entries(grouped).map(([companyName, experiences]) => (
          <div key={companyName} style={{ marginBottom: 40 }}>
            <h2 className="experiences-company-title">{companyName}</h2>
            <div className="experiences-results experiences-results-left">
              {experiences.map((exp) => (
                <div key={exp._id} className="result-card experiences-card">
                  <div className="card-desc">{exp.OT_description}</div>
                  <div className="card-name">{exp.name}</div>
                  <div className="card-company">
                    Interview experience of{" "}
                    <span
                      style={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
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
          </div>
        ))
      )}
    </div>
  );
}

export default Experiences;
