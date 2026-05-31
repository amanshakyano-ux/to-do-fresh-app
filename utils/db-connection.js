require("dotenv").config();
const mongoose = require("mongoose")
 
const db = async ()=>{
    try{
    await mongoose.connect(`mongodb+srv://amanshakyano_db_user:${process.env.MONGO_DB_PASSWORD}@cluster0.fjdefmi.mongodb.net/expense-tracker?retryWrites=true&w=majority`)
    console.log("DB Connected")
    }
    catch(err)
    {
        console.log("Error in DB-connection  file",err.message)
        throw err;
    }
} 
module.exports = db;


// require("dotenv").config()
// const {Sequelize} = require("sequelize")
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USERNAME,
//     process.env.DB_PASSWORD,
//     {
//         host:process.env.HOST,
//         dialect:"mysql"
//     }
// );

// (async()=>{
//     try
//     {
//         await sequelize.authenticate()
//            console.log("DB CONNECTED")
// }catch(err){
//     console.log(`DB ERROR >>> ${err.message}`)
// }})()

// module.exports = sequelize;