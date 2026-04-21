// checking jackinssss here

require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const compression = require("compression");

require("./models"); // keep if needed for Sequelize models

const db = require("./utils/db-connection");

const userRoutes = require("./routes/userR");
const expenseRoutes = require("./routes/expenseR");
const vipUser = require("./routes/leaderboardR");
const passRoutes = require("./routes/passForgetR");
const transactionRoutes = require("./routes/transactionPeriod");

// Create log file safely
const logPath = path.join(__dirname, "access.log");
const accessLogStream = fs.createWriteStream(logPath, { flags: "a" });

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(compression());

// Routes
app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/premium", vipUser);
app.use("/time", transactionRoutes);
app.use("/password", passRoutes);

// HTML routes

app.get("/signup.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/expense.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "expense.html"));
});

app.get("/expenseReport.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "expenseReport.html"));
});

app.get("/resetPassForm.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "resetPassForm.html"));
});

// Port fix ✅
const PORT = process.env.PORT || 3000;

// DB + Server start
db.sync({ alter: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ SERVER IS RUNNING ON PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`❌ SERVER ERROR >> ${err.message}`);
  });
