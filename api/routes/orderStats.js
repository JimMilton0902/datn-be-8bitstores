const express = require("express");
const router = express.Router();
const Payment = require("../models/Bill");

router.get("/", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $match: {
          received: true, // Lọc các đơn hàng đã hoàn tất
        },
      },
      {
        $unwind: "$menuItems",
      },
      {
        $lookup: {
          from: "menus",
          localField: "menuItems",
          foreignField: "_id",
          as: "menuItemDetails",
        },
      },
      {
        $unwind: "$menuItemDetails",
      },
      {
        $group: {
          _id: null, // Không phân nhóm theo danh mục nếu muốn tổng revenue toàn bộ
          quantity: { $sum: "$quantity" },
          revenue: { $sum: "$cartTotals" }, // Tính tổng từ trường cartTotals
        },
      },
      {
        $project: {
          _id: 0,
          totalQuantity: "$quantity",
          totalRevenue: "$revenue",
        },
      },
    ]);

    if (result.length === 0) {
      throw new Error("Không tìm thấy dữ liệu đơn hàng hoàn tất");
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
