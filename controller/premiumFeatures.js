require("dotenv").config();

const AWS = require("aws-sdk");
const FileURL = require("../models/fileUrl");
const User = require("../models/user");
const Expense = require("../models/expense");

const s3 = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
  region: "ap-south-1",
});

const getDownloadedFiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const files = await FileURL.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, files });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const downloadAllExp = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await Expense.find({ userId })
      .select("amount description")
      .sort({ amount: -1 });

    let csv = "Description,Amount\n";

    expenses.forEach((e) => {
      csv += `${e.description},${e.amount}\n`;
    });

    const filename = `expense_${userId}_${new Date().toISOString()}.csv`;

    const response = await s3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Key: filename,
        Body: csv,
        ContentType: "text/csv",
      })
      .promise();

    const fileURL = response.Location;

    await FileURL.create({
      fileUrl: fileURL,
      userId,
    });

    return res.status(200).json({
      success: true,
      fileURL,
    });
  } catch (err) {
    console.log("ERROR 🔴:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const isPremium = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      isPremium: user.isPremium,
    });
  } catch (err) {
    console.log("IS PREMIUM ERROR 🔴:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name totalExpense")
      .sort({ totalExpense: -1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const expenseReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let startDate, endDate;

    if (period === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else if (period === "weekly") {
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
    } else if (period === "monthly") {
      const now = new Date();

      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid period",
      });
    }

    const filter = {
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const totalItems = await Expense.countDocuments(filter);

    const expenses = await Expense.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalResult = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalExp: { $sum: "$amount" },
        },
      },
    ]);

    const totalExp = totalResult.length > 0 ? totalResult[0].totalExp : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return res.json({
      success: true,
      totalItems,
      totalPages,
      currentPage: page,
      data: expenses,
      totalExp,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllUsers,
  isPremium,
  expenseReport,
  downloadAllExp,
  getDownloadedFiles,
};