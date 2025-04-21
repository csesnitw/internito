import React, { useState } from 'react';
import { NAMES } from '../constants/companies'; // Import the list of companies

function Search({ onSearch }) {
  const [company, setCompany] = useState('');
  const [cgpa, setCgpa] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ company, cgpa });
  };

  return (
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
            placeholder="Search by CGPA"
          />
        </label>
      </div>
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;