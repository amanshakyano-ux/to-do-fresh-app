const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const forgotPasswordRequestsSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ForgotPasswordRequest",
  forgotPasswordRequestsSchema
);

// const sequelize = require("../utils/db-connection")
// const {DataTypes, Sequelize}= require("sequelize")
// const { v4: uuidv4 } = require("uuid");

 
// const ForgotPasswordRequests   = sequelize.define("ForgotPasswordRequest",{
//     id:{
//        type:Sequelize.STRING,
//        defaultValue:uuidv4,
//        primaryKey:true
//     },
//     isActive:{
//         type:Sequelize.BOOLEAN,
//         allowNull:false,
//         defaultValue:true
         
//     }
// })
// module.exports = ForgotPasswordRequests ;