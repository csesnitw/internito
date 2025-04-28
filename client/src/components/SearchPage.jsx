import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAMES } from "../constants/companies";
import "./SearchPage.css";

const COMPANY_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6e/Accenture.svg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8e/Infosys_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/Capgemini_201x_logo.svg",
  // Add more as needed
];

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (isNaN(value)) {
      const filteredSuggestions = NAMES.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="search-page">
      <div className="logo-slider-container">
        <div className="logo-slider">
          {[...COMPANY_LOGOS, ...COMPANY_LOGOS].map((logo, idx) => (
            <img
              src={logo}
              alt="Company Logo"
              className="slider-logo"
              key={idx}
              draggable={false}
            />
          ))}
        </div>
      </div>
      <h1 className="main-search-title">
        Search Experiences by <span>Company</span>
      </h1>
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
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchPage;
