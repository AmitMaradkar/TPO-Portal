const express = require("express");
const authStudent = require("../middlewares/authStudent");
const studentController = require("../controllers/studentController");

const router = new express.Router();

// Student Authentication & Password Management
router.post("/student/login", studentController.login_student);
router.post("/student/logout", authStudent, studentController.logout_student);
router.post("/student/password/update", authStudent, studentController.student_update_password);

// Student Profile & Applications
router.get("/student/me", authStudent, studentController.student_profile);
router.get("/student/company/jobs", authStudent, studentController.drive_compaines);
router.get("/student/company/details/:companyId", authStudent, studentController.company_details);
router.get("/student/job/details/:jobId", authStudent, studentController.get_job_details);
router.get("/student/company/job/eligiblity/:jobId", authStudent, studentController.check_eligiblity);
router.post("/student/company/job/apply", authStudent, studentController.apply_company_job);
router.post("/student/resume/upload/:jobId", authStudent, studentController.resume_upload);
router.get("/student/company/job/applied", authStudent, studentController.get_applied_jobs);
router.delete("/student/application/delete/:applicationId", authStudent, studentController.delete_application);
router.get("/student/job/files/:jobId", authStudent, studentController.get_job_file);

module.exports = router;
