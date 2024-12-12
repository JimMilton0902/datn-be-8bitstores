const mongoose = require("mongoose");
const { Schema } = mongoose;

const voucherSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discountAmount: {
      type: Number, // Giảm giá cụ thể (VD: 50,000 VND)
      default: 0,
    },
    discountPercent: {
      type: Number, // Giảm giá theo phần trăm (VD: 10%)
      default: 0,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number, // Số lần được sử dụng
      default: 1,
    },
    usedCount: {
      type: Number, // Số lần đã được sử dụng
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
