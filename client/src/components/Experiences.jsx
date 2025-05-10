import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css'; // For card styles
import './Experiences.css'; // For Experiences-specific styles

function Experiences() {
  const user = useSelector((state) => state.auth.user);
  const [experiences, setExperiences] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      try {
        if (sortBy === 'recent') {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences`,
            { credentials: 'include' }
          );
          const data = await response.json();
          setExperiences(data);
          setGrouped({});
        } else {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/company`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({}),
            }
          );
          const data = await response.json();
          setGrouped(data);
          setExperiences([]);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
      setLoading(false);
    };

    fetchExperiences();
  }, [sortBy]);

  return (
    <div className="exp-page" style={{ minHeight: '100vh', margin:'40px', marginTop:'20px' }}>
      <h1>All Interview Experiences</h1>
      <div className="experiences-header">
        Current Responses : {sortBy === 'recent'
          ? experiences.length
          : Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0)}
      </div>
      <div className="experiences-toolbar">
        <button
          className={`sort-btn${sortBy === 'company' ? ' active' : ''}`}
          onClick={() => setSortBy('company')}
        >
          Sort by Company
        </button>
        <button
          className={`sort-btn${sortBy === 'recent' ? ' active' : ''}`}
          onClick={() => setSortBy('recent')}
        >
          Sort by Recent
        </button>
        <button
          className="search-company-btn"
          onClick={() => navigate('/search')}
        >
          Search for Company
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : sortBy === 'recent' ? (
        <div className="experiences-results">
          {experiences.map((exp) => (
            <div key={exp._id} className="result-card experiences-card">
              <div className="card-desc">
                {exp.OT_description?.slice(0, 180) || ''}...
              </div>
              <div className="card-name">
                {exp.name}
              </div>
              <div className="card-company">
                interview experience of <span style={{ fontWeight: 600 }}>{exp.company?.toLowerCase()}</span>
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
            <h2 style={{ textAlign: 'left', marginLeft: '8vw', marginBottom: 18, color: '#222' }}>{companyName}</h2>
            <div className="experiences-results">
              {experiences.map((exp) => (
                <div key={exp._id} className="result-card experiences-card">
                  <div className="card-desc">
                    {exp.OT_description?.slice(0, 180) || ''}...
                  </div>
                  <div className="card-name">
                    {exp.name}
                  </div>
                  <div className="card-company">
                    interview experience of <span style={{ fontWeight: 600 }}>{exp.company?.toLowerCase()}</span>
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