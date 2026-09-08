import React from "react";
import "../../assets/css/team.css";
import { Link } from "react-router-dom";

const Team = () => {
  const teamMembers = [
    {
      name: "Training & Placement Officer",
      role: "Head of T&P Cell",
      email: "tpo@college.edu",
      icon: "bi-person-badge",
    },
    {
      name: "Assistant TPO",
      role: "Corporate Relations",
      email: "atpo@college.edu",
      icon: "bi-person-lines-fill",
    },
    {
      name: "Placement Coordinator",
      role: "Student Relations & Operations",
      email: "placements@college.edu",
      icon: "bi-people-fill",
    },
  ];

  return (
    <>
      <div className="card text-center">
        <div className="card-body">
          <Link to="/" style={{ textDecoration: "none", color: "gray" }}>
            College TnP Platform
          </Link>
        </div>
      </div>

      <section className="our-webcoderskull padding-lg">
        <div className="container">
          <div className="row heading heading-icon">
            <h2>T&P Cell Team</h2>
          </div>
          <ul className="row justify-content-center">
            {teamMembers.map((member, idx) => (
              <li className="col-12 col-md-6 col-lg-4" key={idx}>
                <div className="cnt-block equal-hight" style={{ height: 349 }}>
                  <figure>
                    <i
                      className={`bi ${member.icon}`}
                      style={{ fontSize: "4rem", color: "#4e73df" }}
                    ></i>
                  </figure>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <ul className="follow-us clearfix">
                    <li>
                      <a href={`mailto:${member.email}`}>
                        <i className="bi bi-envelope"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default Team;