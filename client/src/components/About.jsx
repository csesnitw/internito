import React from "react";
import "./About.css";

function About() {
  const originalDevelopers = [
    {
      name: "Sufiyan Ansari",
      role: "Backend Developer",
      image: "/devs/sufiyan.jpeg",
      linkedin: "https://www.linkedin.com/in/sufiyan-ansari-nitw/",
      github: "https://github.com/suffisme",
    },
    {
      name: "Chaitanya Hardikar",
      role: "Backend Developer",
      image: "/devs/chaitanya.jpeg",
      linkedin: "https://www.linkedin.com/in/chaitanya-hardikar-0ab4821a7/",
      github: "https://github.com/chaitanyahardikar",
    },
    {
      name: "Chirantan Muliya",
      role: "Backend Developer",
      image: "/devs/chirantan.jpeg",
      linkedin: "https://www.linkedin.com/in/chirantan-muliya-961974209/",
      github: "https://github.com/chirantan24",
    },
    {
      name: "Divya Soni",
      role: "Frontend Developer",
      image: "/devs/divya.jpeg",
      linkedin: "https://www.linkedin.com/in/divya-soni14/",
      github: "https://github.com/divya-soni-14",
    },
    {
      name: "Abhishek Upadhyayula",
      role: "Frontend Developer",
      image: "/devs/abhishek.jpeg",
      linkedin: "https://www.linkedin.com/in/abhishek-upadhayayula-a541ba1b8/",
      github: "https://github.com",
    },
  ];

  const rebuildTeam = [
    {
      name: "Devashish Dubal",
      role: "MERN Developer",
      image: "/devs/deva.jpeg",
      linkedin: "https://www.linkedin.com/in/devashish-dubal-344149279/",
      github: "https://github.com/devashishdubal",
    },
    {
      name: "Chetan Kar",
      role: "MERN Developer",
      image: "/devs/chetan.jpeg",
      linkedin: "https://www.linkedin.com/in/chetan-kar-599930288/",
      github: "https://github.com/chetankar65",
    },
    {
      name: "Shubham Pahilwani",
      role: "MERN Developer",
      image: "/devs/shub.jpeg",
      linkedin: "https://www.linkedin.com/in/shubham-pahilwani/",
      github: "https://github.com/shub2726",
    },
  ];

  // SVGs for icons (official)
  const LinkedInIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      style={{ verticalAlign: "middle" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="5" fill="#fff" />
      <path
        d="M7.1 9.5H9.3V17H7.1V9.5ZM8.2 8.5C7.6 8.5 7.1 8 7.1 7.4C7.1 6.8 7.6 6.3 8.2 6.3C8.8 6.3 9.3 6.8 9.3 7.4C9.3 8 8.8 8.5 8.2 8.5ZM10.6 9.5H12.7V10.3H12.7C13 9.8 13.7 9.3 14.6 9.3C16.3 9.3 16.7 10.4 16.7 12V17H14.5V12.5C14.5 11.7 14.5 10.7 13.4 10.7C12.3 10.7 12.2 11.5 12.2 12.5V17H10.6V9.5Z"
        fill="#0077B5"
      />
    </svg>
  );

  const GitHubIcon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      style={{ verticalAlign: "middle" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill="#fff" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6.3c-3.1 0-5.7 2.6-5.7 5.7 0 2.5 1.6 4.6 3.8 5.3.3.1.4-.1.4-.3v-1.1c-1.5.3-1.8-.7-1.8-.7-.3-.6-.7-.8-.7-.8-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.8-1.2-.1-2.5-.6-2.5-2.7 0-.6.2-1.1.6-1.5-.1-.2-.3-.8.1-1.6 0 0 .5-.2 1.7.6.5-.1 1-.2 1.5-.2s1 .1 1.5.2c1.2-.8 1.7-.6 1.7-.6.4.8.2 1.4.1 1.6.4.4.6 1 .6 1.5 0 2.1-1.3 2.6-2.5 2.7.2.2.4.5.4 1v1.5c0 .2.1.4.4.3 2.2-.7 3.8-2.8 3.8-5.3 0-3.1-2.6-5.7-5.7-5.7z"
        fill="#181717"
      />
    </svg>
  );

  const renderDevLinks = (linkedin, github) => (
    <div className="dev-links">
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="dev-btn linkedin"
        aria-label="LinkedIn"
      >
        {LinkedInIcon}
        LinkedIn
      </a>
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="dev-btn github"
        aria-label="GitHub"
      >
        {GitHubIcon}
        GitHub
      </a>
    </div>
  );

  return (
    <div className="about-container">
      <section className="about-intro">
        <h1>
          <span className="about-why">Why</span>{" "}
          <span className="about-internito">interNito</span>
          <span className="about-q">?</span>
        </h1>
        <div className="about-intro-text">
          <p>
            <strong>Internships are tough</strong> — and their interviews even
            tougher.
            <br />
            Unlike exams, you don't get second chances if something goes wrong.
            <br />
            <br />
            <span className="about-highlight">
              So how do you prepare for something you've never done before and
              still ace it like a pro?
            </span>
            <br />
            <span className="about-highlight-green">
              By learning from those who've already done it.
            </span>
            <br />
            <br />
            <span className="about-internito-inline">interNito</span> was born
            from this idea.
            <br />
            <span className="about-small">
              Originally built with HTML and Django, interNito tackled the
              real-world challenge of internship preparation, bridging the gap
              between coursework and career steps.
              <br />
              Now, rebuilt in the MERN stack by the CSES Development Team,
              interNito continues its mission with a stronger, more dynamic
              platform.
            </span>
          </p>
          <p>
            <strong>If you're a senior</strong> who has already completed the
            internship journey, interNito gives you a space to{" "}
            <span className="about-highlight">share your experiences</span> —
            what worked, what didn't, the questions you faced, and the
            challenges you overcame.
            <br />
            <br />
            <strong>If you're a junior</strong> gearing up for your own process,
            you no longer need to search endlessly.
            <br />
            <span className="about-highlight-green">
              How to prepare, how to perform, even how to stay calm during
              interviews — everything you need is right here.
            </span>
            <br />
            <span className="about-small">
              (And yes, for breathing tips: just stay natural!)
            </span>
          </p>
        </div>
      </section>

      <section className="developers-section">
        <h2>
          <span className="about-section-title">Original Developers</span>
        </h2>
        <div className="developer-cards">
          {originalDevelopers.map((dev, index) => (
            <div className="developer-card" key={index}>
              <div className="card-image">
                <img src={dev.image} alt={dev.name} />
              </div>
              <h3>
                <span className="first-name">{dev.name.split(" ")[0]}</span>
                <span className="last-name">{dev.name.split(" ")[1]}</span>
              </h3>
              <p>{dev.role}</p>
              {renderDevLinks(dev.linkedin, dev.github)}
            </div>
          ))}
        </div>
      </section>
      <section className="developers-section">
        <h2>
          <span className="about-section-title">Rebuild Team</span>
        </h2>
        <div className="developer-cards">
          {rebuildTeam.map((dev, index) => (
            <div className="developer-card" key={index}>
              <div className="card-image">
                <img src={dev.image} alt={dev.name} />
              </div>
              <h3>
                <span className="first-name">{dev.name.split(" ")[0]}</span>
                <span className="last-name">{dev.name.split(" ")[1]}</span>
              </h3>
              <p>{dev.role}</p>
              {renderDevLinks(dev.linkedin, dev.github)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
