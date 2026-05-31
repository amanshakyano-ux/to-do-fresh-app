const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileURLSchema = new Schema(
  {
    fileUrl: {
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

module.exports = mongoose.model("FileURL", fileURLSchema);