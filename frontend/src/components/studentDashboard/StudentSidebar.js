import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "../../assets/css/style.css";
import API_BASE_URL from "../../config/api";

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, setCookie] = useCookies();

  const handleSignOut = () => {
    axios
      .post(`${API_BASE_URL}/student/logout`, {}, { withCredentials: true })
      .then(() => {
        setCookie("usertype", "", { path: "/" });
        setCookie("token1", "", { path: "/" });
        setCookie("username", "", { path: "/" });
        navigate("/");
      })
      .catch(() => {});
  };

  const [active, setActive] = useState({
    dash: "active",
    company: "",
    profile: "",
    changePass: "",
  });

  const hideDashBoard = () => {
    const toggleBtn = document.getElementById("navBarBtn");
    if (toggleBtn) {
      toggleBtn.click();
    }
  };

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "dashboard") {
      setActive({ dash: "active", company: "", profile: "", changePass: "" });
    } else if (path === "profile") {
      setActive({ dash: "", company: "", profile: "active", changePass: "" });
    } else if (path === "company-table") {
      setActive({ dash: "", company: "active", profile: "", changePass: "" });
    } else if (path === "update") {
      setActive({ dash: "", company: "", profile: "", changePass: "active" });
    } else {
      setActive({ dash: "", company: "", profile: "", changePass: "" });
    }
  }, [location]);

  return (
    <div>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" to="/student/dashboard">
          College TnP Platform
        </Link>
        <div className="userNavbar">
          Hello, {cookies.username}
        </div>
        <button
          id="navBarBtn"
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      </header>

      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item" onClick={hideDashBoard}>
                  <Link className={`nav-link ${active.dash}`} aria-current="page" to="/student/dashboard">
                    <i className="bi bi-house"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item" onClick={hideDashBoard}>
                  <Link className={`nav-link ${active.company}`} aria-current="page" to="/student/company-table">
                    <i className="bi bi-building"></i> Company
                  </Link>
                </li>
              </ul>

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                <span>Manage Account</span>
              </h6>
              <ul className="nav flex-column mb-2">
                <li className="nav-item" onClick={hideDashBoard}>
                  <Link className={`nav-link ${active.changePass}`} to="/student/password/update">
                    <i className="bi bi-key"></i> Change Password
                  </Link>
                </li>
                <li className="nav-item" onClick={hideDashBoard}>
                  <Link className={`nav-link ${active.profile}`} to="/student/profile">
                    <i className="bi bi-person"></i> Profile
                  </Link>
                </li>
                <li className="nav-item" onClick={handleSignOut}>
                  <Link className="nav-link" to="/">
                    <i className="bi bi-box-arrow-right"></i> Sign Out
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
