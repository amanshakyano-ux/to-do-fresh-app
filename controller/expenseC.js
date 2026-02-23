const { User, Expense } = require("../models");
const sequelize = require("../utils/db-connection");
function isStringInvalid(str) {
  return !str || str.trim().length === 0;
}
const addExpense = async (req, res) => {
  try {

    const t = await sequelize.transaction();

    const { amount, description, category } = req.body;

    const user_id = req.user.id;

    console.log("USER ID IS THIS >>>", user_id);

    if (
      isStringInvalid(amount) ||
      isStringInvalid(description) ||
      isStringInvalid(category)
    ) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "fields are mandatory" });
    }
    const user = await User.findOne({
      where: { id: user_id },
    });
    console.log(user.totalExpense, "TOTAL EXPENSEEESSS");

    const newTotalExpense = user.totalExpense + Number(amount);
    
    user.totalExpense = newTotalExpense; // update value
    await user.save({ transaction: t }); // save instance

    const expense = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      UserId: user_id,
       
    },
    { transaction: t });
    await t.commit();
    res.status(201).json(expense);

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "EXPENSE ADD ERROR >>" + error.message });
  }
};

const getAllExpense = async (req, res) => {
  const user_id = req.user.id;
  console.log(user_id);
  const expenses = await Expense.findAll({
    where: {
      UserId: req.user.id,
    },
  });

  if (expenses.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "no Expenses  exists" });
  }

  res.status(200).json(expenses);
};

const deleteExp = async (req, res) => {
    const transaction =  await sequelize.transaction();
  try {

    const { id } = req.params;
    const user_id = req.user.id;

    const expense = await Expense.findOne({ 
        where: { id: id, UserId: user_id },
        transaction 
    });
      if (!expense) {
      await transaction.rollback();
      return res.status(404).json({ message: "Item not found" });
    }

    const user = await User.findByPk(user_id, { transaction });
     
    const newExpense = user.totalExpense - expense.amount;
    user.totalExpense = newExpense;
    await user.save({transaction});

    await Expense.destroy({
      where: { id, UserId: user_id },
      transaction
    });
   
    await transaction.commit();
    res.status(200).json({ success: true, message: "expense is deleted!!" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: `ERROR FROM DELETE SEC ${err.message}` });
  }
};

module.exports = { addExpense, getAllExpense, deleteExp };
