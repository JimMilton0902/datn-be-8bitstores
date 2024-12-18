const Blog = require("../models/Blog");

//get all blogs
const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//post blogs
const postBlogs = async (req, res) => {
  const newItem = req.body;
  try {
    const result = Blog.create(newItem);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//single blogs
const singleBlogs = async (req, res) => {
  const blogId = req.params.id;
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "không tìm thấy blogs" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//deleted
const deletedBlogs = async (req, res) => {
  const blogId = req.params.id;
  try {
    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    if (!deleteBlog) {
      return res.status(404).json({ message: "không tìm thấy blogs" });
    }
    res.status(200).json(deleteBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { image, title, author, content } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { image, title, author, content },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Không tìm thấy category" });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlog,
  postBlogs,
  singleBlogs,
  deletedBlogs,
  updateBlog,
};
