const{DataTypes} = require("sequelize")
const sequelize = require("../utils/db-connection")

const User = sequelize.define("Users",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    totalExpense:{
        type:DataTypes.INTEGER,
        defaultValue:0
         
    },
    account:{
        type:DataTypes.STRING
    }
})
module.exports = User;
