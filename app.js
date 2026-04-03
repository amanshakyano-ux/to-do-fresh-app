require("dotenv").config();
const express = require("express")
require("./models")

const fs = require("fs")
const path = require("path")
<<<<<<< HEAD

const db = require("./utils/db-connection")
const cors = require("cors")
=======
const cors = require("cors")
const morgan = require("morgan")
const compression = require("compression")

const db = require("./utils/db-connection")
>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3
const userRoutes = require("./routes/userR")
const expenseRoutes = require("./routes/expenseR")
const vipUser = require("./routes/leaderboardR")
const passRoutes = require("./routes/passForgetR")
const transactionRoutes = require("./routes/transactionPeriod")
<<<<<<< HEAD
const morgan = require("morgan")
=======
>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3

const accessLogStream = fs.createWriteStream(
   path.join(__dirname,"access.log"),
    {flags:"a"}
); 
<<<<<<< HEAD
 
 console.log("hhh")
const app = express()


=======
const app = express()
 
>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(morgan("combined",{stream:accessLogStream}))
<<<<<<< HEAD

 


app.use("/user",userRoutes)

app.use("/expense",expenseRoutes)

app.use("/premium",vipUser)

app.use("/time",transactionRoutes)

 
app.use("/password",passRoutes)

=======
app.use(compression())

 
app.use("/user",userRoutes)
app.use("/expense",expenseRoutes)
app.use("/premium",vipUser)
app.use("/time",transactionRoutes)
app.use("/password",passRoutes)


>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3
db.sync({alter:true})
   .then(()=>{
     app.listen(process.env.PORT,()=>{
        console.log("SERVER IS RUNNING")
     })
   })
   .catch((err)=>{
    console.log(`SERVER ERROR >> ${err.message}`)
   })


