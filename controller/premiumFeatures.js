require("dotenv").config()
const AWS = require('aws-sdk');
const FileURL = require("../models/fileUrl")

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: "ap-south-1"
});
console.log("KEY:", process.env.IAM_USER_KEY);
console.log("SECRET:", process.env.IAM_USER_SECRET);
console.log("BUCKET:", process.env.BUCKET_NAME);

const { Sequelize, where } = require("sequelize");
const { User, Expense } = require("../models");
const { Op, sum } = require("sequelize");


const getDownloadedFiles = async (req, res) => {
  try {
    const user_id = req.user.id;

    const files = await FileURL.findAll({
      where: { UserId: user_id },
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({ files });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

                               

const downloadAllExp = async(req,res)=>{
  try{
        const user_id = req.user.id;
        const expenses = await Expense.findAll({
      where:{
        UserId:user_id
      },
      attributes:["amount","description"],
      order:[["amount","DESC"]]
    })
    let csv = "Description,Amount\n";

    expenses.forEach(e=>{
      csv += `${e.description}, ${e.amount}\n`
    })
   

    const filename = `expense_${req.user.id}_${new Date().toISOString()}.csv`

    const response = await s3.upload({
      Bucket:process.env.BUCKET_NAME,
      Key:filename,
      Body:csv,
      ContentType:"text/csv"
    }).promise();
    const fileURL = response.Location

          await FileURL.create({
        fileUrl: fileURL,
        UserId: user_id
      });

        res.status(200).json({
        success: true,
        fileURL
        });

  }catch(err){
  console.log("ERROR 🔴:", err);   // 👈 FULL error print hoga
  res.status(500).json({success:false, message:err.message})
}
}

const isPremium = async (req, res) => {
  try {
    const userId = req.user.id;

    const accType = await User.findOne({
      where: { id: userId },
      attributes: ["account"],
    });
    res.status(200).json(accType);
  } catch (err) {
    console.log("ERROR FROM ISPREMIUM FUNCT", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
     
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "totalExpense",
         
      ],
 
      order: [["totalExpense", "DESC"]],
    });
     
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

 const expenseReport = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { period } = req.query;

    const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let startDate, endDate;

    /* ----------- DATE RANGE LOGIC ----------- */

    if (period === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    }

    else if (period === "weekly") {

      const now = new Date();
      const day = now.getDay();
      const adjustedDay = day === 0 ? 7 : day;
      const diff = adjustedDay - 1;

      startDate = new Date(now);
      startDate.setDate(now.getDate() - diff);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }

    else if (period === "monthly") {

      const now = new Date();

      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid period"
      });
    }

    /* ----------- COMMON QUERY ----------- */

    const { count, rows } = await Expense.findAndCountAll({
      where: {
        UserId: user_id,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    const totalExp = await Expense.sum("amount", {
      where: {
        UserId: user_id,
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      }
    });

    const totalPages = Math.ceil(count / limit);

    return res.json({
      totalItems: count,
      totalPages,
      currentPage: page,
      data: rows,
      totalExp: totalExp || 0
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


module.exports = { getAllUsers, isPremium, expenseReport,downloadAllExp,getDownloadedFiles };
