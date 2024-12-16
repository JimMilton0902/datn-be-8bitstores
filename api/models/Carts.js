  const mongoose = require("mongoose");
  const { Schema } = mongoose;

  const cartSchema = new Schema(
    {
      productItemId: {
        type: Schema.Types.ObjectId, // Referencing the Menu schema
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
    },
    { timestamps: true }
  );

  const Cart = mongoose.model("Cart", cartSchema);

  module.exports = Cart;
