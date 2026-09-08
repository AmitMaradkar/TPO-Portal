import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/style.css";
import "../../assets/css/studentdashboardhome.css";
import { Link } from "react-router-dom";
import BranchPieChart from "./Company/charts/BranchPiChart";
import BarChart from "./Company/charts/BarChart";
import API_BASE_URL from "../../config/api";

export default function AdminDashboard() {
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/dashboard/details`, {
        withCredentials: true,
      })
      .then((res) => {
        setDashboardDetails(res.data.dashboard_details || {});
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div id="studentdashboard">
        <h1>Welcome to College TnP Cell!</h1>
        <div className="row">
          <div className="col-md-4 my-5">
            <Link
              to="/admin/student-table"
              style={{ textDecoration: "none", color: "#565656" }}
            >
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Enrolled students</h5>
                  <div className="col d-flex align-items-center">
                    <i className="bi bi-people"></i>
                    <div>
                      <h4 className="fw-bold mb-0">
                        {dashboardDetails.totalStudents || 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 my-5">
            <Link
              to="/admin/company-table"
              style={{ textDecoration: "none", color: "#565656" }}
            >
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Visited companies</h5>
                  <div className="col d-flex align-items-center">
                    <i className="bi bi-building"></i>
                    <div>
                      <h4 className="fw-bold mb-0">
                        {dashboardDetails.totalCompanies || 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 my-5">
            <Link
              to="/admin/placedStudents"
              style={{ textDecoration: "none", color: "#565656" }}
            >
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Placed students</h5>
                  <div className="col d-flex align-items-center">
                    <i className="bi bi-mortarboard"></i>
                    <div>
                      <h4 className="fw-bold mb-0">
                        {dashboardDetails.placedStudents || 0}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4 my-5">
            <Link
              to="/admin/generate-report"
              style={{ textDecoration: "none", color: "#565656" }}
            >
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Average CTC</h5>
                  <div className="col d-flex align-items-center">
                    <i className="bi bi-currency-rupee"></i>
                    <div>
                      <h4 className="fw-bold mb-0">
                        {dashboardDetails.avgSalaryBaggedByPlacedStudents != null
                          ? parseFloat(
                              dashboardDetails.avgSalaryBaggedByPlacedStudents
                            ).toFixed(2)
                          : 0}{" "}
                        LPA
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-4">
              <BranchPieChart
                csPlacedStudents={dashboardDetails.csPlacedStudents}
                itPlacedStudents={dashboardDetails.itPlacedStudents}
                entcPlacedStudents={dashboardDetails.entcPlacedStudents}
              />
            </div>
            <div className="col-md-8">
              <BarChart
                csPlacedStudents={dashboardDetails.csPlacedStudents}
                itPlacedStudents={dashboardDetails.itPlacedStudents}
                entcPlacedStudents={dashboardDetails.entcPlacedStudents}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
