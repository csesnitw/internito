import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Experiences.css'; // For Experiences-specific styles
import './AdminDashboard.css'; // For AdminDashboard-specific styles


const AdminDashboard = () => {
  const [experiences, setExperiences] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null);

  /*
  * This function polls the server to check if the user is an admin, and sets the isAdmin state accordingly.
  */
  const checkAdminStatus = async () => {
      try{
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/admin/checkAdmin`, {
          method: "GET",
          credentials: "include"
        });
        const data = await res.json();
        data.success ? setIsAdmin(true) : setIsAdmin(false);
      } 
      catch (error){
        console.error("Error getting admin status:", error);
        setIsAdmin(false);
      }
  };

  useEffect(() => {
    // I'll keep the emails here until admin works in prod 
    // if (user && !["dv22csb0f38","dp22csb0f23","sp22csb0f08"].includes(user.username)) { //change this later
    //   // Redirect to home page if not admin
    //   navigate("/");
    // }
    //if (!user) return;
    checkAdminStatus();

  }, []);

  useEffect(() => {
    if (isAdmin !== true) return;
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/experiences/pending`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.ok){
          setExperiences(data);
          setLoading(false);
        }
        else {
          console.error("Failed to fetch experiences:", data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching experiences:", error);
      }
    };
    fetchExperiences();
  }, [isAdmin]);

  if(isAdmin === false) {  
    return (
      <div className="not-admin">
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <h1>Admin Dashboard</h1>
      {(loading || isAdmin === null) ? (
        <div>Loading...</div>
      ) : (
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
                onClick={() => navigate(`/admin/${exp._id}`)}
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
