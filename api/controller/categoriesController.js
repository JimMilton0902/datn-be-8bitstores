const Categories = require("../models/categories");

// Lấy tất cả categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Categories.find({}).sort({ name: 1 }); // Sắp xếp theo tên
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm mới category
const postCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await Categories.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy một category cụ thể
const singleCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await Categories.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật category
const updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;

  try {
    const updatedCategory = await Categories.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa category
const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const deletedCategory = await Categories.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.status(200).json({ message: "Xoá category thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCategories,
  postCategory,
  singleCategory,
  updateCategory,
  deleteCategory,
};
