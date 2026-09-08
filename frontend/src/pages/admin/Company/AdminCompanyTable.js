import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/admincompanytable.css";
import API_BASE_URL from "../../../config/api";

const AdminCompanyTable = () => {
  const [companyTable, setCompanyTable] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/company/jobs`, {
          withCredentials: true,
        });
        setCompanyTable(res.data.data || []);
      } catch (err) {
        setCompanyTable([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
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
    <div id="adminCOmpanyTable">
      <div className="col-md-6 col-sm-6 cl-sx-6 col-6">
        <h3>Company records</h3>
      </div>
      <div className="row my-3" style={{ padding: "10px" }}>
        <div className="d-flex justify-content-between">
          <div className="filter col-md-3">
            <label htmlFor="searchCompany" className="form-label">
              Search company
            </label>
            <input
              type="text"
              className="form-control"
              id="searchCompany"
              placeholder="Search for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div id="searchHelp" className="form-text">
              Enter the name of company
            </div>
          </div>
          <div className="col-md-3">
            <Link to="/admin/add-company">
              <button className="btn btn-primary">
                <i className="bi bi-plus-circle"></i> Add a Company
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="row" style={{ width: "94%" }}>
        {companyTable
          .filter((company) =>
            company.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((company, index) => (
            <div key={company._id || index} className="col-md-5 m-3">
              <div className="card">
                <div className="card-header">
                  <h5>{company.name}</h5>
                </div>
                <div className="card-body">
                  <div className="card-text" style={{ fontSize: "15px" }}>
                    <ol>
                      {company.jobDescriptions && company.jobDescriptions.length
                        ? company.jobDescriptions.map((desc, key) => (
                            <li key={key}>
                              {desc.name} : round - {desc.currentRound}{" "}
                              <i className="bi bi-arrow-right"></i>{" "}
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/admin/company/details/${desc._id}`);
                                }}
                              >
                                View Details
                              </Link>
                            </li>
                          ))
                        : "No job opening record available"}
                    </ol>
                  </div>
                  <hr />
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/admin/add-job", {
                        state: {
                          companyId: company._id,
                          companyName: company.name,
                        },
                      });
                    }}
                    value={company._id}
                    style={{ float: "right" }}
                  >
                    Add job opening
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminCompanyTable;
