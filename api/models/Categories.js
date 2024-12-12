const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema({
  name: {
    type: String,
    trim: true,
    require: true,
    minlength: 3,
  },
});

const categories = mongoose.model("Categories", categoriesSchema);

module.exports = categories;
