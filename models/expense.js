   const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
    
    // const{DataTypes} = require("sequelize")
    // const sequelize = require("../utils/db-connection")

    // const Expense =   sequelize.define("Expense",{
    // id:{
    //     type:DataTypes.INTEGER,
    //     primaryKey:true,
    //     autoIncrement:true
    // },
    // amount:{
    //     type:DataTypes.INTEGER

    // },
    // description:{
    //     type:DataTypes.STRING
    // },
    // category:{
    //     type:DataTypes.STRING
    // }
    // })
    // module.exports = Expense;