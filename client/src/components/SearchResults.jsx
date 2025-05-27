import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./SearchPage.css";
import "./Experiences.css";

function SearchResults() {
  const { query } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const branch = params.get("branch") || "";
    const cgpa = params.get("cgpa") || "";

    const fetchResults = async () => {
      setErrorMessage("");
      setResults({});
      try {
        const response = await fetch(
          `${
            process.env.REACT_APP_API_URL || "http://localhost:8000"
          }/api/experiences/company`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company: query === "all" ? "" : query,
              branch,
              cgpa,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          if (Object.keys(data).length === 0) {
            setErrorMessage(
              "No results found. Try selecting a different company, branch, or CGPA."
            );
          } else {
            setResults(data);
          }
        } else {
          setErrorMessage("Failed to fetch search results.");
        }
      } catch (error) {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    };
    fetchResults();
  }, [query, location.search]);

  return (
    <div className="exp-page">
      <h1
        className="main-search-title"
        style={{ textAlign: "center", marginBottom: 10 }}
      >
        Search Results for <span>{query}</span>
      </h1>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="experiences-results experiences-results-left">
        {Object.keys(results).length > 0 &&
          Object.entries(results).map(([companyName, experiences]) => (
            <div key={companyName} style={{ width: "100%", marginBottom: 40 }}>
              <h2 className="experiences-company-title">
                <span>{companyName}</span>
              </h2>
              <div className="experiences-results experiences-results-left">
                {experiences.map((experience) => (
                  <div
                    key={experience._id}
                    className="result-card experiences-card"
                  >
                    <div className="card-desc">{experience.OT_description}</div>
                    <div className="card-name">{experience.name}</div>
                    <div className="card-company">
                      Interview experience of{" "}
                      <span
                        style={{ fontWeight: 600, textTransform: "capitalize" }}
                      >
                        {experience.company?.toLowerCase()}
                      </span>
                    </div>
                    <button
                      className="read-more-btn"
                      onClick={() => navigate(`/experiences/${experience._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchResults;
