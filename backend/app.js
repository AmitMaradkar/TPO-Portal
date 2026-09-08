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
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Connected to Database. Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

app.use(studentRouter);
app.use(adminRouter);
app.use(companyRouter);
