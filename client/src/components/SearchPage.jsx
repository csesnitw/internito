import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { NAMES } from "../constants/companies";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

const COMPANY_LOGOS = [
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/D._E._Shaw_%26_Co._Logo.svg/1920px-D._E._Shaw_%26_Co._Logo.svg.png",
    name: "D.E. Shaw",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Goldman_Sachs_logo.svg/375px-Goldman_Sachs_logo.svg.png",
    name: "Goldman Sachs",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    name: "Google",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/768px-Microsoft_logo_%282012%29.svg.png",
    name: "Microsoft",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/500px-Salesforce.com_logo.svg.png",
    name: "Salesforce",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png",
    name: "Uber",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
    name: "Oracle",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png",
    name: "Mastercard",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/500px-Visa_2021.svg.png",
    name: "Visa",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png",
    name: "Samsung",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Wells_Fargo_Bank.svg/453px-Wells_Fargo_Bank.svg.png",
    name: "Wells Fargo",
  },
  {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Qualcomm-Logo.svg/1200px-Qualcomm-Logo.svg.png",
    name: "Qualcomm",
  },
];

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="search-page">
      <div className="logo-slider-container">
        <Marquee gradient={false} speed={60} pauseOnHover={true}>
          {COMPANY_LOGOS.map((logo, idx) => (
            <img
              src={logo.url}
              alt={logo.name}
              key={idx}
              onClick={() => navigate(`/search/${encodeURIComponent(logo.name)}`)} // Navigate on click
              title={logo.name} // Title attribute for accessibility
            />
          ))}
        </Marquee>
      </div>

      <h1 className="main-search-title">
        Search Experiences by <span>Company</span>
      </h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
          Enter a company name to search, or enter your CGPA to see the
          companies you're eligible for.
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchPage;
