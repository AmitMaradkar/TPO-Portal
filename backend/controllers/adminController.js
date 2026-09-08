const Admin = require("../models/admin");
const Student = require("../models/student");
const jwt = require("jsonwebtoken");
const Company = require("../models/company");
// const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Job = require("../models/job");
const Application = require("../models/application");
const { createToken } = require("../utils/createToken");
const maxAge = 3 * 24 * 60 * 60;

// handle error
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "Incorrect Email") {
    errors.email = "Email is not Registered";
  }
  // incorrect password
  if (err.message === "Incorrect Password") {
    errors.password = "Wrong password";
  }

  // duplicate error code
  if (err.code == 11000) {
    errors.email = "This Email is already Registered";
  }

  // validation Eroor
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

// maxtime for which token is active
const tokenAge = parseInt(process.env.JWT_AGE);

// sign up
module.exports.signup_admin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.create({ email, password });
    const token = createToken(admin._id);
    res.cookie("token", token, { httpOnly: true, maxAge: maxAge * 1000 }); //3 days
    res.status(201).json({ admin, usertype: "admin", token, success: true });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error, success: false });
  }
};

// login admin
module.exports.login_admin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.login(email, password);
    const token = createToken(admin._id);
    admin = await Admin.findById(admin);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    }); // 3 days
    res.status(200).json({ admin, usertype: "admin", token, success: true });
  } catch (err) {
    const error = handleErrors(err);
    res.status(400).json({ error, success: false });
  }
};

// logout admin
module.exports.logout_admin = (req, res) => {
  req.admin._id = "";
  res.cookie("token", "", { maxAge: 1 });
  res.cookie("usertype", "", { maxAge: 1 });
  res.send({ success: true, message: "Logged Out." });
};

// upate password
module.exports.admin_update_password = async (req, res) => {
  const admin = await Admin.findById(req.admin._id);

  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    admin.password
  );

  if (!isPasswordMatched) {
    return res.status(403).send("Passwords do not match");
  }

  // frontend compare newpassword with confirm password

  admin.password = req.body.newPassword;

  await admin.save();

  res.status(200).json({ success: true, message: "Password Updated." });
};

module.exports.register_student = async (req, res) => {
  const student = req.body;

  const { error } = Student.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    await Student.create(student);
    res
      .status(201)
      .json({ success: true, message: "Student Registered Successfully." });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

//     students.forEach(async (student) => {
//       await Student.create(student);
//     });

//     students.forEach((student) => {
//       array.push(student.email);
//     });

//     // console.log(array);
//         res.status(201).json({
//       success: true,
//       message: "All Students Registered Successfully."
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       errors: err
//     });
//   }
// };
module.exports.register_students = async (req, res) => {
  const students = req.body;

  try {
    for (const student of students) {
      console.log("Inserting student:", student.firstName, student.rollNumber);
      await Student.create(student);
    }

    res.status(201).json({
      success: true,
      message: "All Students Registered Successfully."
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// get Company Job
module.exports.get_job = async (req, res) => {
  try {
    let job = await Job.findById(req.params.jobId).populate("company");
    if (!job) {
      return res.status(404).json({ success: true, message: "Job not found" })
    }
    res.status(200).json({
      success: true,
      data: job,
      message: "Job & Company found"
    })
  } catch (err) {
    // console.log(err);
    res.status(404).json({ succss: false, message: "Job not found" })
  }
}

module.exports.get_company_jobs = async (req, res) => {
  try {
    const companyList = await Company.find().populate({
      path: "jobDescriptions",
    });
    res.status(200).json({
      success: true,
      message: "current companies drive",
      data: companyList,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
      message: "Error while getting the company jobs",
    });
  }
};

module.exports.get_student = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate({ path: "applications", populate: { path: "job", populate: { path: "company" } } });
    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student Not Found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Student Found", data: student });
  } catch (err) {
    res.status(400).json({ errors: err, success: false });
  }
};

module.exports.get_all_students = async (req, res) => {
  try {
    const studentList = await Student.find();
    return res
      .status(200)
      .json({ success: true, message: "Student List", data: studentList });
  } catch (err) {
    res.status(400).json({ errors: err, success: false });
  }
};

const isCsBranch = (branch) => {
  if (!branch) return false;
  const b = branch.toString().toLowerCase().trim();
  return b === "cs" || b === "ce" || b.includes("comp");
};

const isItBranch = (branch) => {
  if (!branch) return false;
  const b = branch.toString().toLowerCase().trim();
  return b === "it" || b.includes("info");
};

const isEntcBranch = (branch) => {
  if (!branch) return false;
  const b = branch.toString().toLowerCase().trim();
  return b === "entc" || b === "etc" || b.includes("elect") || b.includes("telecom");
};

const isMaleGender = (gender) => {
  if (!gender) return false;
  const g = gender.toString().toLowerCase().trim();
  return g === "male" || g === "m";
};

module.exports.get_dashboard_details = async (req, res) => {
  try {
    const allStudents = await Student.find().lean();
    const allCompanies = await Company.find().lean();
    const allJobs = await Job.find().lean();

    const placedStudentsList = allStudents.filter(
      (s) => s.LTE20?.status || s.GT20?.status
    );

    let csPlacedStudents = 0;
    let itPlacedStudents = 0;
    let entcPlacedStudents = 0;

    placedStudentsList.forEach((s) => {
      if (isCsBranch(s.branch)) csPlacedStudents++;
      else if (isItBranch(s.branch)) itPlacedStudents++;
      else if (isEntcBranch(s.branch)) entcPlacedStudents++;
    });

    const totalPlacedStudentsCount = placedStudentsList.length;

    // finding total and average ctc offered to placed students
    let totalSalaryOfferedByAllJobs = 0;
    placedStudentsList.forEach((s) => {
      const placedJobId = s.GT20?.status ? s.GT20?.jobId : s.LTE20?.jobId;
      if (placedJobId) {
        const job = allJobs.find(
          (j) => j._id.toString() === placedJobId.toString()
        );
        if (job && job.ctc) {
          totalSalaryOfferedByAllJobs += Number(job.ctc);
        }
      }
    });

    const avgSalaryBaggedByPlacedStudents =
      totalPlacedStudentsCount > 0
        ? parseFloat((totalSalaryOfferedByAllJobs / totalPlacedStudentsCount).toFixed(2))
        : 0;

    const avgSalaryBaggedByAllStudents =
      allStudents.length > 0
        ? parseFloat((totalSalaryOfferedByAllJobs / allStudents.length).toFixed(2))
        : 0;

    const dashboard_details = {
      totalStudents: allStudents.length,
      csPlacedStudents,
      itPlacedStudents,
      entcPlacedStudents,
      totalCompanies: allCompanies.length,
      placedStudents: totalPlacedStudentsCount,
      unplacedStudents: allStudents.length - totalPlacedStudentsCount,
      avgSalaryBaggedByPlacedStudents,
      avgSalaryBaggedByAllStudents,
    };

    res.status(200).json({ success: true, dashboard_details });
  } catch (err) {
    res.status(400).json({ errors: err.message, success: false });
  }
};

module.exports.get_job_round_applied_students = async (req, res) => {
  const { jobId, roundNo } = req.params;
  try {
    Job.findById(jobId)
      .populate({ path: "jobApplications" })
      .exec(async function (err, job) {
        const studentIds = [];
        // console.log(job);
        job.jobApplications.map((application) => {
          if (application.studentRoundCleared >= roundNo - 1) {
            studentIds.push(application.studentId);
          }
        });
        const data = await Student.find({ _id: { $in: studentIds } });
        res.status(200).json({
          success: true,
          data,
          message: `Applied Students of Round ${roundNo}.`,
        });
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
      message: "Error while getting Applied Students",
    });
  }
};

module.exports.get_job_round_qualified_students = async (req, res) => {
  const { jobId, roundNo } = req.params;
  try {
    Job.findById(jobId)
      .populate({ path: "jobApplications" })
      .exec(async function (err, job) {
        const studentIds = [];
        job.jobApplications.map((application) => {
          if (application.studentRoundCleared >= roundNo) {
            studentIds.push(application.studentId);
          }
        });
        const data = await Student.find({ _id: { $in: studentIds } });
        res.status(200).json({
          success: true,
          data,
          message: `Qualified Students of Round ${roundNo}.`,
        });
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
      message: "Error while getting Disqualified Students",
    });
  }
};

module.exports.get_job_round_disqualified_students = async (req, res) => {
  const { jobId, roundNo } = req.params;
  try {
    Job.findById(jobId)
      .populate({ path: "jobApplications" })
      .exec(async function (err, job) {
        const studentIds = [];
        job.jobApplications.map((application) => {
          if (
            application.studentRoundCleared == roundNo - 1 &&
            application.studentResult == false
          ) {
            studentIds.push(application.studentId);
          }
        });
        const data = await Student.find({ _id: { $in: studentIds } });
        res.status(200).json({
          success: true,
          data,
          message: `Disqualified Students of Round ${roundNo}.`,
        });
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
      message: "Error while getting Disqualified Students",
    });
  }
};

//
//Generate placed student Report list,excel:

module.exports.get_placed_students = async (req, res) => {
  try {
    let students = await Student.find({
      $or: [{ "LTE20.status": { $eq: true } }, { "GT20.status": { $eq: true } }],
    })
      .populate({
        path: "LTE20.jobId",
        populate: { path: "companyId", model: "Company" },
      })
      .populate({
        path: "GT20.jobId",
        populate: { path: "companyId", model: "Company" },
      })
      .populate({
        path: "applications",
        populate: { path: "jobId", populate: { path: "companyId", model: "Company" } },
      });

    if (!students) {
      return res
        .status(404)
        .json({ success: false, message: "No Student Found!" });
    }

    return res
      .status(200)
      .json({ success: true, message: "List of students", data: students });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// generate report
module.exports.generate_report = async (req, res) => {
  try {
    const reportArr = [];

    const jobs = await Job.find().populate("company").lean();
    const allStudents = await Student.find().lean();

    for (let i = 0; i < jobs.length; i++) {
      let job = jobs[i];
      let obj = {};
      let maleStudentsCount = 0;
      let femaleStudentsCount = 0;
      let ugCsStudentsCount = 0;
      let ugItStudentsCount = 0;
      let ugEntcStudentsCount = 0;
      let pgCsStudentsCount = 0;
      let pgItStudentsCount = 0;
      let pgEntcStudentsCount = 0;

      let jobCriteriaUG = job.criteria?.ug || {};
      let jobCriteriaPG = job.criteria?.pg || {};
      let companyName = job.company?.name;
      if (!companyName && job.companyId) {
        const comp = await Company.findById(job.companyId).lean();
        companyName = comp?.name || "N/A";
      }
      obj.companyName = companyName || "N/A";

      const cgpa = job.criteria?.engCgpa || job.criteria?.aggrCgpa || "NC";
      obj.cgpa = cgpa;

      // Branch criteria formatting
      if (
        jobCriteriaUG.cs &&
        jobCriteriaUG.it &&
        jobCriteriaUG.entc &&
        jobCriteriaPG.cs &&
        jobCriteriaPG.it &&
        jobCriteriaPG.entc
      ) {
        obj.branches = "All (UG and PG)";
      } else if (jobCriteriaUG.cs && jobCriteriaUG.it && jobCriteriaUG.entc) {
        obj.branches = "All (UG)";
      } else if (jobCriteriaPG.cs && jobCriteriaPG.it && jobCriteriaPG.entc) {
        obj.branches = "All (PG)";
      } else if (
        jobCriteriaUG.cs &&
        jobCriteriaUG.it &&
        jobCriteriaUG.entc &&
        (jobCriteriaPG.cs || jobCriteriaPG.it || jobCriteriaPG.entc)
      ) {
        obj.branches = "All (UG) and";
        if (jobCriteriaPG.cs) obj.branches += " CE ";
        if (jobCriteriaPG.it) obj.branches += " IT ";
        if (jobCriteriaPG.entc) obj.branches += " ENTC ";
        obj.branches += "(PG)";
      } else if (
        (jobCriteriaUG.cs || jobCriteriaUG.it || jobCriteriaUG.entc) &&
        jobCriteriaPG.cs &&
        jobCriteriaPG.it &&
        jobCriteriaPG.entc
      ) {
        obj.branches = "(";
        if (jobCriteriaUG.cs) obj.branches += " CE ";
        if (jobCriteriaUG.it) obj.branches += " IT ";
        if (jobCriteriaUG.entc) obj.branches += " ENTC ";
        obj.branches += "- (UG) & ALL (PG)";
      } else {
        obj.branches = "";
        if (jobCriteriaUG.cs) obj.branches += " CE ";
        if (jobCriteriaUG.it) obj.branches += " IT ";
        if (jobCriteriaUG.entc) obj.branches += " ENTC ";
        obj.branches += "-(UG) & ";
        if (jobCriteriaPG.cs) obj.branches += " CE ";
        if (jobCriteriaPG.it) obj.branches += " IT ";
        if (jobCriteriaPG.entc) obj.branches += " ENTC ";
        obj.branches += "-(PG)";
      }

      obj.salary = job.ctc;
      obj.visitDate = job.roundDetails?.[0]?.date || "N/A";

      // Find all students placed in this job
      const placedStudentsForJob = allStudents.filter((student) => {
        if (
          student.GT20?.status &&
          student.GT20?.jobId?.toString() === job._id.toString()
        ) {
          return true;
        }
        if (
          student.LTE20?.status &&
          student.LTE20?.jobId?.toString() === job._id.toString()
        ) {
          return true;
        }
        return false;
      });

      placedStudentsForJob.forEach((student) => {
        if (isMaleGender(student.gender)) {
          maleStudentsCount++;
        } else {
          femaleStudentsCount++;
        }

        if (student.isUg) {
          if (isCsBranch(student.branch)) ugCsStudentsCount++;
          else if (isItBranch(student.branch)) ugItStudentsCount++;
          else if (isEntcBranch(student.branch)) ugEntcStudentsCount++;
        } else {
          if (isCsBranch(student.branch)) pgCsStudentsCount++;
          else if (isItBranch(student.branch)) pgItStudentsCount++;
          else if (isEntcBranch(student.branch)) pgEntcStudentsCount++;
        }
      });

      const totalStudentsCount = maleStudentsCount + femaleStudentsCount;
      obj.male = maleStudentsCount;
      obj.female = femaleStudentsCount;
      obj.total = totalStudentsCount;
      obj.ugCsStudentsCount = ugCsStudentsCount;
      obj.ugItStudentsCount = ugItStudentsCount;
      obj.ugEntcStudentsCount = ugEntcStudentsCount;
      obj.pgCsStudentsCount = pgCsStudentsCount;
      obj.pgItStudentsCount = pgItStudentsCount;
      obj.pgEntcStudentsCount = pgEntcStudentsCount;
      obj.totalSalaryOfferedByJob = totalStudentsCount * (job.ctc || 0);

      reportArr.push(obj);
    }

    res.send({
      success: true,
      data: reportArr,
      message: "Placement Report Generated",
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports.student_application_delete = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.remove();

    res.status(200).json({
      success: true,
      message: "Application Deleted Successfully.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err,
      message: "Error while Deleting Application.",
    });
  }
}