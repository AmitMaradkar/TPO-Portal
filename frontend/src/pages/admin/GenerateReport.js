import "../../assets/css/admincompanytable.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ReportTable from "./Company/Report/ReportTable";
import API_BASE_URL from "../../config/api";

const GenerateReport = () => {
    const [companyTable, setCompanyTable] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            try {
                const res = await axios.get(`${API_BASE_URL}/admin/student/report/generate`, {
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
                <h3>Placement Report</h3>
            </div>
            <ReportTable reportData={companyTable} />
        </div>
    );
};

export default GenerateReport;