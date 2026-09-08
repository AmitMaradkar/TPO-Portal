const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const adminController = require("../controllers/adminController");

const router = new express.Router();

// Admin Authentication
router.post("/admin/signup", adminController.signup_admin);
router.post("/admin/login", adminController.login_admin);
router.post("/admin/logout", authAdmin, adminController.logout_admin);

// Admin Password Management
router.post("/admin/password/update", authAdmin, adminController.admin_update_password);

// Student Registration & Management
router.post("/admin/register/student", authAdmin, adminController.register_student);
router.post("/admin/register/students", authAdmin, adminController.register_students);
router.get("/admin/student/profile/:studentId", authAdmin, adminController.get_student);
router.get("/admin/student/all", authAdmin, adminController.get_all_students);
router.get("/admin/student/placed", authAdmin, adminController.get_placed_students);
router.delete("/admin/student/application/delete/:applicationId", authAdmin, adminController.student_application_delete);

// Company & Job Management
router.get("/admin/company/job/details/:jobId", authAdmin, adminController.get_job);
router.get("/admin/company/jobs", authAdmin, adminController.get_company_jobs);
router.get("/admin/company/applied/:roundNo/:jobId", authAdmin, adminController.get_job_round_applied_students);
router.get("/admin/company/qualified/:roundNo/:jobId", authAdmin, adminController.get_job_round_qualified_students);
router.get("/admin/company/disqualified/:roundNo/:jobId", authAdmin, adminController.get_job_round_disqualified_students);

// Dashboard & Reports
router.get("/admin/dashboard/details", authAdmin, adminController.get_dashboard_details);
router.get("/admin/student/report/generate", authAdmin, adminController.generate_report);

module.exports = router;
