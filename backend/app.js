require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
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

let dbError = null;

// Database connection helper with connection reuse for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGODB_URL) {
    dbError = "MONGODB_URL is missing in environment variables";
    console.error(dbError);
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5s timeout to prevent Lambda kill
    });
    dbError = null;
    console.log("Connected to MongoDB Database");
  } catch (err) {
    dbError = err.message;
    console.error("Database connection failed:", err);
  }
};

// Health check endpoint (placed before DB middleware so it always returns immediately)
app.get(["/api/health", "/health"], (req, res) => {
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };
  const dbStatus = dbStates[mongoose.connection.readyState] || "unknown";
  res.status(200).json({
    status: "ok",
    message: "TPO Portal API is running",
    database: dbStatus,
    hasMongoUri: Boolean(process.env.MONGODB_URL),
    dbError: dbError,
    nodeEnv: process.env.NODE_ENV || "development",
  });
});

// Middleware to ensure DB connection is ready before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
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

