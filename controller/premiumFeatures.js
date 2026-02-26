const { Sequelize, where } = require("sequelize");
const { User, Expense } = require("../models");
const { Op, sum } = require("sequelize");

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
    console.log("gelAllUsers called");
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "totalExpense",
        // [Sequelize.fn("SUM", Sequelize.col("Expenses.amount")), "totalExpense"]
      ],

      // include: [
      //   {
      //     model: Expense,
      //     attributes: []
      //   }
      // ],
      // group: ["Users.id"],
      order: [["totalExpense", "DESC"]],
    });
    console.log("QUERY DONE >>>>>");
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


module.exports = { getAllUsers, isPremium, expenseReport };
