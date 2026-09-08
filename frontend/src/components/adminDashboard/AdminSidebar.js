import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../assets/css/style.css";
import { useCookies } from "react-cookie";
import AddadminForm from "../../pages/admin/addAdmin/addAdminForm";
import API_BASE_URL from "../../config/api";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setCookie] = useCookies();

  const [active, setActive] = useState({
    dash: 'active',
    company: '',
    student: '',
    changePass: '',
    placeStudent: '',
    report: ''
  });

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard') {
      setActive({ dash: 'active', company: '', student: '', changePass: '', placeStudent: '', report: '' });
    } else if (path === 'student-table') {
      setActive({ dash: '', company: '', student: 'active', changePass: '', placeStudent: '', report: '' });
    } else if (path === 'company-table') {
      setActive({ dash: '', company: 'active', student: '', changePass: '', placeStudent: '', report: '' });
    } else if (path === 'update') {
      setActive({ dash: '', company: '', student: '', changePass: 'active', placeStudent: '', report: '' });
    } else if (path === 'placedStudents') {
      setActive({ dash: '', company: '', student: '', changePass: '', placeStudent: 'active', report: '' });
    } else if (path === 'generate-report') {
      setActive({ dash: '', company: '', student: '', changePass: '', placeStudent: '', report: 'active' });
    } else {
      setActive({ dash: '', company: '', student: '', changePass: '', placeStudent: '', report: '' });
    }
  }, [location]);

  const hideDashBoard = () => {
    const toggleBtn = document.getElementById("navBarBtn");
    if (toggleBtn) {
      toggleBtn.click();
    }
  };

  const handleSignOut = () => {
    axios.post(`${API_BASE_URL}/admin/logout`, {}, { withCredentials: true })
      .then(() => {
        setCookie("usertype", "", { path: "/" });
        setCookie("token1", "", { path: "/" });
        setCookie("username", "", { path: "/" });
        navigate("/");
      })
      .catch(() => {});
  };

  return (
    <div>
      <header style={{ marginTop: "-60px" }} className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <Link className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" to="/admin/dashboard">
          College TnP Platform
        </Link>
        <div className="userNavbar">
          Hello, Admin!
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
      <div>
        <div className="container-fluid">
          <div className="row">
            <nav
              id="sidebarMenu"
              className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
              <div className="position-sticky pt-3 sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.dash}`} aria-current="page" to="/admin/dashboard">
                      <i className="bi bi-house"></i> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.student}`} to="/admin/student-table" >
                      <i className="bi bi-person"></i> Students
                    </Link>
                  </li>
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.placeStudent}`} to="/admin/placedStudents" >
                      <i className="bi bi-mortarboard"></i> Placed Students
                    </Link>
                  </li>
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.company}`} to="/admin/company-table">
                      <i className="bi bi-building"></i> Company
                    </Link>
                  </li>
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.report}`} to="/admin/generate-report">
                      <i className="bi bi-clipboard2-data"></i> Generate Report
                    </Link>
                  </li>
                </ul>

                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                  <span>Manage Account</span>
                </h6>
                <ul className="nav flex-column mb-2">
                  <li className="nav-item" data-bs-toggle="modal" data-bs-target="#addadminform" onClick={hideDashBoard}>
                    <Link className="nav-link" to="#">
                      <i className="bi bi-person-rolodex"></i> Add admin
                    </Link>
                  </li>
                  
                  <li className="nav-item" onClick={hideDashBoard}>
                    <Link className={`nav-link ${active.changePass}`} to="/admin/password/update" >
                      <i className="bi bi-key"></i> Change Password
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

            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
              </div>
            </main>

            <AddadminForm />
          </div>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
