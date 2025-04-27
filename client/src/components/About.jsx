import React from 'react';
import './About.css'; // Add styles for the About page

function About() {
  const originalDevelopers = [
    {
      name: 'Sufiyan Ansari',
      role: 'Backend Developer',
      image: '/devs/sufiyan.jpg',
      linkedin: 'https://www.linkedin.com/in/sufiyan-ansari/',
    },
    {
      name: 'Chaitanya Hardikar',
      role: 'Backend Developer',
      image: '/devs/sufiyan.jpg',
      linkedin: 'https://www.linkedin.com/in/chaitanya-hardikar/',
    },
    {
      name: 'Divya Soni',
      role: 'Frontend Developer',
      image: '/devs/sufiyan.jpg',
      linkedin: 'https://www.linkedin.com/in/divya-soni/',
    },
    {
      name: 'Abhishek Upadhyayula',
      role: 'Frontend Developer',
      image: '/devs/sufiyan.jpg',
      linkedin: 'https://www.linkedin.com/in/abhishek-upadhyayula/',
    },
    {
      name: 'Chirantan Muliya',
      role: 'Backend Developer',
      image: '/devs/sufiyan.jpg',
      linkedin: 'https://www.linkedin.com/in/chirantan-muliya/',
    },
  ];

  const rebuildTeam = [
    {
      name: 'Devashish Dubal',
      role: 'MERN Developer',
      image: '/devs/sufiyan.jpg', // Placeholder image
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Chetan Kar',
      role: 'MERN Developer',
      image: '/devs/sufiyan.jpg', // Placeholder image
      linkedin: 'https://www.linkedin.com/',
    },
    {
      name: 'Shubham Pahilwani',
      role: 'MERN Developer',
      image: '/devs/sufiyan.jpg', // Placeholder image
      linkedin: 'https://www.linkedin.com/',
    },
  ];

  return (
    <div className="about-container">
      <section className="about-intro">
        <h1>Why interNito?</h1>
        <div className="about-intro-text">
          <p>
          Internships are tough — and their interviews even tougher. Unlike exams, you don't get second chances if something goes wrong. So how do you prepare for something you've never done before and still ace it like a pro? By learning from those who've already done it. That's the idea behind interNito. Originally developed using HTML and Django, interNito was created to tackle the real-world challenge of internship preparation, bridging the gap between coursework and career steps. Now, rebuilt in the MERN stack by the CSES Development Team, interNito continues its mission with a stronger, more dynamic platform.
          </p>
          <p>
          If you're a senior who has already completed the internship journey, interNito gives you a space to share your experiences — what worked, what didn't, the questions you faced, and the challenges you overcame. And if you're a junior gearing up for your own process, you no longer need to search endlessly. How to prepare, how to perform, even how to stay calm during interviews — everything you need is right here. (And yes, for breathing tips: just stay natural!)
          </p>
        </div>
      </section>

      <section className="developers-section">
        <h2>Original Developers</h2>
        <div className="developer-cards">
          {originalDevelopers.map((dev, index) => (
            <div className="developer-card" key={index}>
              <div className="card-image">
                <img src={dev.image} alt={dev.name} />
              </div>
              <h3>
                <span className="first-name">{dev.name.split(' ')[0]}</span>
                <span className="last-name">{dev.name.split(' ')[1]}</span>
              </h3>
              <p>{dev.role}</p>
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="developers-section">
        <h2>MERN Rebuild Team</h2>
        <div className="developer-cards">
          {rebuildTeam.map((dev, index) => (
            <div className="developer-card" key={index}>
              <div className="card-image">
                <img src={dev.image} alt={dev.name} />
              </div>
              <h3>
                <span className="first-name">{dev.name.split(' ')[0]}</span>
                <span className="last-name">{dev.name.split(' ')[1]}</span>
              </h3>
              <p>{dev.role}</p>
              <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;