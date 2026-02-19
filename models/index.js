const User = require("./user")
const Expense = require("./expense")

//one to many association 

User.hasMany(Expense,{foreignKey:"UserId", onDelete:"cascade"})
Expense.belongsTo(User,{foreignKey:"UserId"})

module.exports = {
    User,Expense
}