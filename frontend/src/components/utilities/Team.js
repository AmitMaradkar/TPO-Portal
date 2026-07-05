import "../../assets/css/team.css";
import ved from "../../assets/img/ved.jpg"
import devansh from "../../assets/img/devansh.jpeg"
import sangmeshwar from "../../assets/img/sangmeshwar.jpg"
import gaurav from "../../assets/img/gaurav.jpg"
import kedar from "../../assets/img/kedar.jpg"
import rohit from "../../assets/img/rohit.jpg"
import vinayak from "../../assets/img/vinayak.JPG"
import sudarshan from "../../assets/img/sudarshan.jpg"
import harshal from "../../assets/img/harshal.jpg"
import {Link} from "react-router-dom";
import { useState } from "react";

const Team = () => {

  const team = [

    {src:vinayak, name: "Vinayak", desc: "Backend",git: "https://", linkedin: "https://www.linkedin.com", email: "mailto:@gmail.com"},

  ]
    return ( 
      <>
      <div className="card text-center">
                    <div className="card-body">
                 <Link to="/" style={{textDecoration:"none",color:"gray"}}>  College TnP Platform </Link>
                    </div>
                </div>

      <section className="our-webcoderskull padding-lg">
        
      <div className="container">
        <div className="row heading heading-icon">
          <h2>Our Team</h2>
        </div>
        <ul className="row">
          {
            team && team.map((t, key)=>
              <li className="col-12 col-md-6 col-lg-3" key={key}>
              <div className="cnt-block equal-hight" style={{ height: 349 }}>
                <figure>
                  <img
                    src={t.src}
                    className="img-responsive"
                    alt=""
                  />
                </figure>
                <h3>
                  {t.name}
                </h3>
                <p>{t.desc}</p>
                <ul className="follow-us clearfix">
                  <li>
                    <a href={t.git}>
                        <i className="bi bi-github"></i>
                    </a>
                  </li>
                  <li>
                    <a href={t.linkedin}>
                      <i className="bi bi-linkedin"></i>
                    </a>
                  </li>
                  <li>
                    <a href={t.email}>
                      <i className="bi bi-envelope"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            )
          }

        </ul>
      </div>
    </section>
    </>
    
     );
}
 
export default Team;