const express = require("express");
const authAdmin = require("../middlewares/authAdmin");
const companyController = require("../controllers/companyController");

const router = new express.Router();

// Company CRUD operations
router.post("/company/add", authAdmin, companyController.add_company);
router.post("/company/update", authAdmin, companyController.update_company);
router.delete("/company/delete/:id", authAdmin, companyController.delete_company);

// Job Openings & Files
router.post("/company/job/add", authAdmin, companyController.add_job);
router.post("/job/files/:companyId/:jobId", authAdmin, companyController.upload_job_files);
router.post("/company/job/update", authAdmin, companyController.update_job);
router.delete("/company/job/delete/:id", authAdmin, companyController.delete_job);

// Job Rounds & Results
router.post("/company/job/round/add", authAdmin, companyController.job_round_add);
router.post("/company/job/round/update", authAdmin, companyController.job_round_update);
router.post("/company/job/round/delete", authAdmin, companyController.job_round_delete);
router.post("/company/job/round/result/declare", authAdmin, companyController.job_round_result_declare);
router.post("/company/job/round/result/update", authAdmin, companyController.job_round_result_update);

// Unplaced Students & Override Eligibility
router.get("/company/job/unplacedStudentsList/:jobId", authAdmin, companyController.get_all_unplaced_students);
router.post("/company/job/apply/uneligible/:jobId/:studentId", authAdmin, companyController.apply_uneligible_student);

module.exports = router;
