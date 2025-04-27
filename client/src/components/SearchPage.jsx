import React, { useState } from 'react';
import { NAMES } from '../constants/companies'; // Import the list of companies

function SearchPage() {
  const [company, setCompany] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [results, setResults] = useState([]); // State to store search results
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setResults([]);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ company, cgpa }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data.length === 0) {
          setErrorMessage('No results found. Try adjusting your filters.');
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

  return (
    <div>
      <h1>Search Experiences</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div>
          <label>
            Company Name:
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            >
              <option value="">Select a company</option>
              {NAMES.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            CGPA Cutoff:
            <input
              type="number"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="Enter CGPA"
            />
          </label>
        </div>
        <button type="submit">Search</button>
      </form>

      {/* Display Error Message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Display Results */}
      <div>
        {results.length > 0 &&
          results.map((result) => (
            <div key={result._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
              <h3>{result.company}</h3>
              <p><strong>Position:</strong> {result.position}</p>
              <p><strong>CGPA Cutoff:</strong> {result.cgpaCutoff}</p>
              <p><strong>Batch:</strong> {result.batch}</p>
              <p><strong>Experience Type:</strong> {result.experienceType}</p>
              <p><strong>Online Test:</strong> {result.OT_description}</p>
              <p><strong>Interview:</strong> {result.interview_description}</p>
              <p><strong>Other Comments:</strong> {result.other_comments}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchPage;