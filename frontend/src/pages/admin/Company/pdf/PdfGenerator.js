import jsPDF from "jspdf";
import "jspdf-autotable";

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

const PdfGenerator = (companies) => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = [
    "Roll No",
    "College Id",
    "Name",
    "Mobile No",
    "Branch",
    "Placed Company",
  ];
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  companies.forEach((compan) => {
    const companyData = [
      compan.rollNumber,
      compan.pictRegistrationId,
      compan.firstName + " " + compan.lastName,
      compan.phone,
      compan.branch,
      getPlacedCompanyName(compan),
    ];
    // push each ticket's info into a row
    tableRows.push(companyData);
  });

  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  const date = Date().split(" ");
  // we use a date string to generate our filename.
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  // ticket title. and margin-top + margin-left
  doc.text("Placed students list", 14, 15);
  // we define the name of our PDF file.
  doc.save(`report_${dateStr}.pdf`);
};

export default PdfGenerator;