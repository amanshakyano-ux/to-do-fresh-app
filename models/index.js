const User = require("./user")
const Expense = require("./expense")
const ForgotPasswordRequests  = require("./resetPass")
const FileURL = require("./fileUrl")


User.hasMany(FileURL)
FileURL.belongsTo(User)

//one to many association 

User.hasMany(Expense,{foreignKey:"UserId", onDelete:"cascade"})
Expense.belongsTo(User,{foreignKey:"UserId"})


User.hasMany(ForgotPasswordRequests );
ForgotPasswordRequests.belongsTo(User);

module.exports = {
    User,Expense,ForgotPasswordRequests 
}