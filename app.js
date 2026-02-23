require("dotenv").config();
const express = require("express")
require("./models")
 
const db = require("./utils/db-connection")
const cors = require("cors")
const userRoutes = require("./routes/userR")
const expenseRoutes = require("./routes/expenseR")
const vipUser = require("./routes/leaderboardR")
const passReset = require("./routes/passForgetR")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/user",userRoutes)

app.use("/expense",expenseRoutes)

app.use("/premium",vipUser)

app.use("/called",passReset)

db.sync({alter:true})
   .then(()=>{
     app.listen(process.env.PORT,()=>{
        console.log("SERVER IS RUNNING")
     })
   })
   .catch((err)=>{
    console.log(`SERVER ERROR >> ${err.message}`)
   })


