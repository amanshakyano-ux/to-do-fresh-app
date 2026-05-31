const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentSessionId: {
      type: String,
      required: true,
    },

    orderAmount: {
      type: Number,
      required: true,
    },

    orderCurrency: {
      type: String,
      required: true,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      required: true,
      default: "PENDING",
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

module.exports = mongoose.model("Payment", paymentSchema);