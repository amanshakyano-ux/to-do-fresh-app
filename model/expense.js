    const{DataTypes} = require("sequelize")
    const sequelize = require("../utils/db-connection")

    const Expense =   sequelize.define("Expense",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    amount:{
        type:DataTypes.INTEGER

    },
    description:{
        type:DataTypes.STRING
    },
    category:{
        type:DataTypes.STRING
    }
    })
    module.exports = Expense;