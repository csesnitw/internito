import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAMES } from "../constants/companies";
import { useEffect, useRef } from "react";
import "./SearchPage.css";

const COMPANY_LOGOS = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/D._E._Shaw_%26_Co._Logo.svg/1920px-D._E._Shaw_%26_Co._Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Goldman_Sachs_logo.svg/375px-Goldman_Sachs_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/768px-Microsoft_logo_%282012%29.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/500px-Salesforce.com_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ec/Morgan_Stanley_Logo_2024.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/500px-Visa_2021.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Qualcomm-Logo.svg/1200px-Qualcomm-Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/453px-Wells_Fargo_Bank.svg.png",

  // Add more as needed
];

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const navigate = useNavigate();


  // --- Slider logic ---
  const sliderRef = useRef(null);
  const animationRef = useRef();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const logosCount = COMPANY_LOGOS.length;
    const logoWidth = slider.children[0]?.offsetWidth || 200;
    const gap = parseInt(getComputedStyle(slider).gap) || 40;
    const totalWidth = logosCount * (logoWidth + gap);

    let start;
    function animate(ts) {
      if (!start) start = ts;
      const speed = 60; // px per second
      const elapsed = ts - start;
      let newOffset = (elapsed / 1000) * speed;

      if (newOffset > totalWidth) {
        start = ts;
        newOffset = 0;
      }
      setOffset(-newOffset);
      animationRef.current = requestAnimationFrame(animate);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

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
        <div
          className="logo-slider"
          ref={sliderRef}
          style={{
            transform: `translateX(${offset}px)`,
          }}
        >
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
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Company or Branch or CGPA"
          className="search-input"
          list="company-suggestions"
        />
        <datalist id="company-suggestions">
          {NAMES.map((name, idx) => (
            <option value={name} key={idx} />
          ))}
        </datalist>
        <div className="search-tips">
        Enter a company name to search, or enter your CGPA to see the companies you're eligible for.
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchPage;
