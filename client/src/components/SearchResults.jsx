import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SearchPage.css';

function SearchResults() {
  const { query } = useParams();
  const [results, setResults] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const isCgpaSearch = !isNaN(query) && query.trim() !== '';
    const fetchResults = async () => {
      setErrorMessage('');
      setResults({});
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/company`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              company: isCgpaSearch ? '' : query,
              cgpa: isCgpaSearch ? parseFloat(query) : undefined,
            }),
          }
        );
        const data = await response.json();
        if (response.ok) {
          if (Object.keys(data).length === 0) {
            setErrorMessage('No results found. Try selecting a different company or CGPA.');
          } else {
            setResults(data);
          }
        } else {
          setErrorMessage('Failed to fetch search results.');
        }
      } catch (error) {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Results for <span>{query}</span></h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="search-results">
        {Object.keys(results).length > 0 &&
          Object.entries(results).map(([companyName, experiences]) => (
            <div key={companyName} className="company-group">
              <h2>{companyName}</h2>
              {experiences.map((experience) => (
                <div key={experience._id} className="result-card">
                  <h3>{experience.company}</h3>
                  <p><strong>Position:</strong> {experience.position}</p>
                  <p><strong>CGPA Cutoff:</strong> {experience.cgpaCutoff}</p>
                  <p><strong>Batch:</strong> {experience.batch}</p>
                  <p><strong>Experience Type:</strong> {experience.experienceType}</p>
                  <p><strong>Online Test:</strong> {experience.OT_description}</p>
                  <p><strong>Interview:</strong> {experience.interview_description}</p>
                  <p><strong>Other Comments:</strong> {experience.other_comments}</p>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchResults;