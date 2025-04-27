import React, { useState } from 'react';
import { NAMES } from '../constants/companies'; // Import the list of companies
import './SearchPage.css'; // Add a CSS file for styling

function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]); // State for autocomplete suggestions
  const [results, setResults] = useState([]); // State to store search results
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResults([]);

    const isCgpaSearch = !isNaN(searchInput) && searchInput.trim() !== '';

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/company`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            company: isCgpaSearch ? '' : searchInput,
            cgpa: isCgpaSearch ? parseFloat(searchInput) : undefined,
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
      console.error('Error fetching search results:', error);
      setErrorMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // Show autocomplete suggestions only for text input
    if (isNaN(value)) {
      const filteredSuggestions = NAMES.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions for numeric input
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="search-page">
      <h1>Search Experiences by <span>Company</span></h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="autocomplete-container">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Enter Company Name or CGPA"
            className="search-input"
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="autocomplete-item"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Display Error Message */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Display Results */}
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

      <footer className="search-footer">
        <p>Copyright © 2021 interNito</p>
        <p>Made with ❤ by Sufiyan, Chaitanya, Chirantan, Divya & Abhishek</p>
      </footer>
    </div>
  );
}

export default SearchPage;