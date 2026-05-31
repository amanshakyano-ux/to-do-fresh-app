const User = require("../models/user");
const Expense = require("../models/expense");

function isStringInvalid(str) {
  return !str || String(str).trim().length === 0;
}

const addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user._id;

    if (
      isStringInvalid(amount) ||
      isStringInvalid(description) ||
      isStringInvalid(category)
    ) {
      return res.status(400).json({
        success: false,
        message: "Fields are mandatory",
      });
    }

    const expense = await Expense.create({
      amount: Number(amount),
      description,
      category,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { totalExpense: Number(amount) },
    });

    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "EXPENSE ADD ERROR >> " + error.message,
    });
  }
};

const getAllExpense = async (req, res) => {
  try {
    const expenses = await Expense.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "GET EXPENSE ERROR >> " + err.message,
    });
  }
};

const deleteExp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const expense = await Expense.findOne({
      _id: id,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    await Expense.deleteOne({
      _id: id,
      userId,
    });

    await User.findByIdAndUpdate(userId, {
      $inc: { totalExpense: -Number(expense.amount) },
    });

    return res.status(200).json({
      success: true,
      message: "Expense deleted!!",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `ERROR FROM DELETE SEC ${err.message}`,
    });
  }
};

module.exports = { addExpense, getAllExpense, deleteExp };