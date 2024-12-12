const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  postCategory,
  singleCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoriesController");

router.get("/", getAllCategories);
router.post("/", postCategory);
router.get("/:id", singleCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
