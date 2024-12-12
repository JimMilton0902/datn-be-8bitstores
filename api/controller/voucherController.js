const Voucher = require("../models/Voucher");

// Get all vouchers
const getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({}).sort({ createdAt: -1 });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new voucher
const createVoucher = async (req, res) => {
  const newVoucher = req.body;
  try {
    const result = await Voucher.create(newVoucher);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single voucher by ID
const getSingleVoucher = async (req, res) => {
  const voucherId = req.params.id;
  try {
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a voucher
const updateVoucher = async (req, res) => {
  const voucherId = req.params.id;
  const updatedData = req.body;
  try {
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      updatedData,
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json(updatedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a voucher
const deleteVoucher = async (req, res) => {
  const voucherId = req.params.id;
  try {
    const deletedVoucher = await Voucher.findByIdAndDelete(voucherId);
    if (!deletedVoucher) {
      return res.status(404).json({ message: "Không tìm thấy voucher" });
    }
    res.status(200).json(deletedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const validateVoucher = async (req, res) => {
  const { code } = req.body; // Lấy mã voucher từ body
  try {
    const voucher = await Voucher.findOne({ code, isActive: true });
    if (!voucher) {
      return res.status(404).json({ 
        isValid: false, 
        message: "Mã voucher không hợp lệ hoặc không tồn tại" 
      });
    }

    // Kiểm tra hạn sử dụng
    if (new Date() > voucher.expirationDate) {
      return res.status(400).json({ 
        isValid: false, 
        message: "Mã voucher đã hết hạn" 
      });
    }

    // Kiểm tra số lần sử dụng
    if (voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ 
        isValid: false, 
        message: "Mã voucher đã hết lượt sử dụng" 
      });
    }

    // Trả thông tin voucher nếu hợp lệ
    res.status(200).json({ 
      isValid: true, 
      discountAmount: voucher.discountAmount, 
      discountPercent: voucher.discountPercent 
    });
  } catch (error) {
    res.status(500).json({ 
      isValid: false, 
      message: "Đã xảy ra lỗi trong quá trình kiểm tra voucher" 
    });
  }
};

const useVoucher = async (req, res) => {
  try {
    const { code } = req.body;

    // Kiểm tra nếu không có 'code' trong body
    if (!code) {
      return res.status(400).json({ message: "Voucher code is required" });
    }

    // Tìm voucher theo mã code
    const voucher = await Voucher.findOne({ code });

    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }

    // Kiểm tra trạng thái hoạt động và số lần sử dụng
    if (!voucher.isActive || voucher.usedCount >= voucher.usageLimit) {
      return res
        .status(400)
        .json({ message: "Voucher is invalid or usage limit exceeded" });
    }

    // Cập nhật số lần sử dụng
    voucher.usedCount += 1;
    await voucher.save();

    res.status(200).json({ message: "Voucher used successfully", voucher });
  } catch (error) {
    console.error("Error in useVoucher:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getAllVouchers,
  createVoucher,
  getSingleVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  useVoucher
};
