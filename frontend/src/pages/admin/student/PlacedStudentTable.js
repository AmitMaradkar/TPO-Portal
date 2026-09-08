import axios from "axios";
import API_BASE_URL from "../../../config/api";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../../assets/css/admincompanytable.css";
import PdfGenerator from "../Company/pdf/PdfGenerator";

const PlacedStudentTable = () => {
  const [studentTable, setStudentTable] = useState([]);
  // const [branchName, setBranchName] = useState("");

  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // const [filteredTable, setFilteredTable] = useState([]);
  const [branch, setBranch] = useState({
    cs: true,
    it: true,
    entc: true,
  });

  const [course, setCourse] = useState({
    ug: true,
    pg: true,
  });

  const getPlacedCompanyName = (student) => {
    if (student.GT20?.status && student.GT20?.jobId) {
      return (
        student.GT20.jobId.companyId?.name ||
        student.GT20.jobId.company?.name ||
        student.GT20.jobId.name ||
        "N/A"
      );
    }
    if (student.LTE20?.status && student.LTE20?.jobId) {
      return (
        student.LTE20.jobId.companyId?.name ||
        student.LTE20.jobId.company?.name ||
        student.LTE20.jobId.name ||
        "N/A"
      );
    }
    if (student.applications && student.applications.length > 0) {
      const selectedApp = student.applications.find(
        (app) => app.studentResult && app.studentRoundCleared > 0
      );
      if (selectedApp?.jobId?.companyId?.name) {
        return selectedApp.jobId.companyId.name;
      }
      if (selectedApp?.job?.[0]?.company?.[0]?.name) {
        return selectedApp.job[0].company[0].name;
      }
    }
    return "N/A";
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/student/placed`, {
        withCredentials: true,
      })
      .then((res) => {
        setStudentTable(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  const handleDownloadExcel = () => {
    const table = document.getElementById("table-to-xls");
    if (!table) return;

    const workbook = XLSX.utils.table_to_book(table);
    const filename = 'Course-[ '+(course.pg ? 'PG ': '')+(course.ug ? 'UG': '')+ ' ] Branch-[ ' +(branch.cs ? 'CS ': '')+(branch.it ? 'IT ': '')+(branch.entc ? 'ENTC ': '')+'] - '+'Placed Students' + '.xlsx';
    XLSX.writeFile(workbook, filename);
  };

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
      <div className="col-md-4 col-sm-4 col-sx-4 col-4">
        <h3>Student table</h3>
      </div>
      <div className="my-3">
        <div
          className="row justify-content-between"
          style={{ alignItems: "center" }}
        >
          <div className="filter col-md-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Search student
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              placeholder="search for..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              Enter the details like firstname
            </div>
          </div>
          <div className="col-md-2" style={{ marginTop: "14px" }}>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter by course
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={course.ug}
                        onChange={() =>
                          setCourse({ ...course, ug: !course.ug })
                        }
                        role="switch"
                        id="flexSwitchCheckDefault40"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault40"
                      >
                        UG
                      </label>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={course.pg}
                        onChange={() =>
                          setCourse({ ...course, pg: !course.pg })
                        }
                        role="switch"
                        id="flexSwitchCheckDefault50"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault50"
                      >
                        PG
                      </label>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-2" style={{ marginTop: "14px" }}>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Filter by branch
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={branch.cs}
                        onChange={() =>
                          setBranch({ ...branch, cs: !branch.cs })
                        }
                        role="switch"
                        id="flexSwitchCheckDefault"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                      >
                        Computer Engineering
                      </label>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={branch.it}
                        onChange={() =>
                          setBranch({ ...branch, it: !branch.it })
                        }
                        role="switch"
                        id="flexSwitchCheckDefault1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault1"
                      >
                        Information Technology
                      </label>
                    </div>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={branch.entc}
                        onChange={() =>
                          setBranch({ ...branch, entc: !branch.entc })
                        }
                        role="switch"
                        id="flexSwitchCheckDefault3"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault3"
                      >
                        EnTC
                      </label>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="col-md-4 mx-3">
            <select className="form-select" aria-label="Default select example">
              <option disabled selected>
                Select particular company
              </option>
              <option value="PhonePe">PhonePe</option>
              <option value="Zomato">Zomato</option>
            </select>
          </div> */}
        </div>
      </div>

      <button className="btn btn-success my-3" onClick={handleDownloadExcel}>
        Download Excel
      </button>

      <button className="btn btn-secondary mx-2" onClick={()=>{PdfGenerator(studentTable)}}>
        Download PDF
      </button>

      <table id="table-to-xls" className="table table-hover">
        <thead className="table-dark darkRow">
          <tr>
            <th scope="col">Roll No</th>
            <th scope="col">College Id</th>
            <th scope="col">Name</th>
            <th scope="col">Mobile No</th>
            <th scope="col">Branch</th>
            <th scope="col">Placed Company</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {studentTable
            .filter((student) => {
              const b = (student.branch || "").toLowerCase();
              const isCs = b === "cs" || b === "ce" || b.includes("comp");
              const isIt = b === "it" || b.includes("info");
              const isEntc = b === "entc" || b === "etc" || b.includes("elect") || b.includes("telecom");
              const matchesBranch =
                (branch.cs && isCs) ||
                (branch.it && isIt) ||
                (branch.entc && isEntc);
              const matchesCourse =
                (course.ug && student.isUg) || (course.pg && !student.isUg);
              return matchesCourse && matchesBranch;
            })
            .filter((student) =>
              student.firstName
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            )
            .map((student, key) => (
              <tr key={key}>
                <td>{student.rollNumber}</td>
                <td>{student.pictRegistrationId}</td>
                <td>
                  {student.firstName} {student.middleName} {student.lastName}
                </td>
                <td>{student.phone}</td>
                <td>{student.branch}</td>
                <td>{getPlacedCompanyName(student)}</td>
                <td>
                  <Link to="#" onClick={(e)=>{e.preventDefault(); navigate(`/admin/student/profile/${student._id}`)}}>View</Link>
                </td>
              </tr>
            ))}

          {/* {studentTable.filter(student => student.firstName.toLowerCase().includes(searchQuery.toLowerCase())).map((student, key) => (
                        <tr key={key}>
                            <td>{student.rollNumber}</td>
                            <td>{student.pictRegistrationId}</td>
                            <td>{student.firstName} {student.middleName} {student.lastName}</td>
                            <td>{student.phone}</td>
                            <td>{student.branch}</td>
                            <td> PhonePe</td>
                            <td><Link to={`/admin/student/profile/${student._id}`}>View</Link></td>
                        </tr>
                    ))} */}
        </tbody>
      </table>

      <div />
    </div>
  );
};

export default PlacedStudentTable;
