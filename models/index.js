const User = require("./user")
const Expense = require("./expense")
const ForgotPasswordRequests  = require("./resetPass")
<<<<<<< HEAD
=======
const FileURL = require("./fileUrl")


User.hasMany(FileURL)
FileURL.belongsTo(User)
>>>>>>> 9c55c1579cba2be873530755941cb95dcc1018c3

//one to many association 

User.hasMany(Expense,{foreignKey:"UserId", onDelete:"cascade"})
Expense.belongsTo(User,{foreignKey:"UserId"})


User.hasMany(ForgotPasswordRequests );
ForgotPasswordRequests.belongsTo(User);

module.exports = {
    User,Expense,ForgotPasswordRequests 
}