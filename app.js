

// checking jackinssss here  



require("dotenv").config();
const express = require("express")
require("./models")

const fs = require("fs")
const path = require("path")
 
 
const cors = require("cors")
 
 
const morgan = require("morgan")
const compression = require("compression")

const db = require("./utils/db-connection")
 
const userRoutes = require("./routes/userR")
const expenseRoutes = require("./routes/expenseR")
const vipUser = require("./routes/leaderboardR")
const passRoutes = require("./routes/passForgetR")
const transactionRoutes = require("./routes/transactionPeriod")




const accessLogStream = fs.createWriteStream(
   path.join(__dirname,"access.log"),
   {flags:"a"}
); 


 
const app = express()
app.use(express.static(path.join(__dirname, "public")));


 
 
 
 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(morgan("combined",{stream:accessLogStream}))
 
 
app.use(compression())

 //routes
app.use("/user",userRoutes)
app.use("/expense",expenseRoutes)
app.use("/premium",vipUser)
app.use("/time",transactionRoutes)
app.use("/password",passRoutes)

//html file serving

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
 const PORT = process.env.PORT || 3000;
db.sync({alter:false})
   .then(()=>{
     app.listen(process.env.PORT,()=>{
        console.log("SERVER IS RUNNING")
     })
   })
   .catch((err)=>{
    console.log(`SERVER ERROR >> ${err.message}`)
   })


