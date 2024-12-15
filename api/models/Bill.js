const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    idTransaction: String,
    name: String,
    email: String,
    quantity: Number,
    status: String,
    cartItem: Array,
    menuItems: Array,
    itemName: Array,
    cartTotals: Number,
    address: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    received: {
      type: Boolean,
      default: false, // Chưa nhận đơn hàng
    },
  },
  {
    timestamps: { createdAt: "createAt", updatedAt: "updateAt" },
  }
);

const Payment = mongoose.model("Bill", paymentSchema);

module.exports = Payment;
