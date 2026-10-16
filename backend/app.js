require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const studentRouter = require("./routes/studentRoute");
const adminRouter = require("./routes/adminRoute");
const companyRouter = require("./routes/companyRoute");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Database connection helper with connection reuse for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGODB_URL) {
    console.warn("MONGODB_URL environment variable is missing!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Database");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

// Middleware to ensure DB connection is ready before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "TPO Portal API is running" });
});

// Support both /api prefixed routes (for Vercel rewrites) and root routes
app.use("/api", studentRouter);
app.use("/api", adminRouter);
app.use("/api", companyRouter);

app.use(studentRouter);
app.use(adminRouter);
app.use(companyRouter);

// Start standalone server only when run directly (local development)
if (require.main === module) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log(`Connected to Database. Server running on port: ${port}`);
    });
  });
}

module.exports = app;

