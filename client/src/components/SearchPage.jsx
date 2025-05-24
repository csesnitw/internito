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

const BRANCHES = [
  "CSE",
  "ECE",
  "EEE",
  "MECH",
  "CHEM",
  "CIVIL",
  "MME",
  "BIOTECH",
];

function SearchPage() {
  const [searchInput, setSearchInput] = useState("");
  const [branch, setBranch] = useState("");
  const [cgpa, setCgpa] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (cgpa) {
      const cgpaNum = parseFloat(cgpa);
      if (isNaN(cgpaNum) || cgpaNum <= 0 || cgpaNum >= 10) {
        alert("CGPA must be a number between 0 and 10.");
        return;
      }
    }
    // Build query string for params
    const params = new URLSearchParams();
    if (branch) params.append("branch", branch);
    if (cgpa) params.append("cgpa", cgpa);

    // If company is entered, use as path param, else use "all"
    const companyParam = searchInput.trim()
      ? encodeURIComponent(searchInput.trim())
      : "all";
    const queryString = params.toString();
    if (queryString) {
      navigate(`/search/${companyParam}?${queryString}`);
    } else {
      navigate(`/search/${companyParam}`);
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
  onClick={() => {
    setSearchInput(logo.name);
    setTimeout(() => {
      document.getElementById("search-form").requestSubmit();
    }, 0);
  }}
  title={logo.name}
  style={{ cursor: "pointer" }}
/>
          ))}
        </Marquee>
      </div>
      <h1 className="main-search-title">
        Search Experiences by <span>Company</span>
      </h1>
      <form id="search-form" onSubmit={handleSearch} className="search-form">
        <div className="search-fields-row">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Company"
            className="search-input search-input-small company-search-input"
            list="company-suggestions"
          />
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="search-branch-select search-input-small"
          >
            <option value="" disabled hidden>
              Branch (optional)
            </option>
            {BRANCHES.map((b) => (
              <option value={b} key={b}>
                {b}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            placeholder="CGPA (optional)"
            className="search-cgpa-input search-input-small"
            min="0"
            max="10"
            step="0.01"
          />
        </div>
        <datalist id="company-suggestions">
          {NAMES.map((name, idx) => (
            <option value={name} key={idx} />
          ))}
        </datalist>
        <div className="search-tips">
          Enter a company name, select branch, or enter your CGPA to filter
          results.
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchPage;
