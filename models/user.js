const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    totalExpense: {
      type: Number,
      default: 0,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);


// const{DataTypes} = require("sequelize")
// const sequelize = require("../utils/db-connection")

// const User = sequelize.define("Users",{
//     id:{
//         type:DataTypes.INTEGER,
//         autoIncrement:true,
//         primaryKey:true
//     },
//     name:{
//         type:DataTypes.STRING
//     },
//     email:{
//         type:DataTypes.STRING
//     },
//     password:{
//         type:DataTypes.STRING
//     },
//     totalExpense:{
//         type:DataTypes.INTEGER,
//         defaultValue:0
         
//     },
//     isPremium:{
//         type:DataTypes.BOOLEAN,
//         defaultValue:false
//     }
// })
// module.exports = User;
