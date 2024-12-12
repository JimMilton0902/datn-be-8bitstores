const express = require("express");
const router = express.Router();
const Payment = require("../models/Payments");

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



//test debug menuItems
router.get("/debug", async (req, res) => {
  try {
    const payments = await Payment.find(); // Lấy tất cả các bản ghi từ bảng Payments
    payments.forEach((payment) => {
      res.send(payment.menuItems); // In ra giá trị của trường menuItems trong từng bản ghi
    });

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/debug1", async (req, res) => {
  try {
    const result = await Payment.aggregate([
      {
        $unwind: "$menuItems",
      },
      {
        $lookup: {
          from: "menus",
          localField: "menuItems", // Kiểm tra trường localField ở đây
          foreignField: "_id", // Kiểm tra trường foreignField ở đây
          as: "menuItemDetails",
        },

        // $group: {
        //   _id: "$menuItemDetails.category",
        //   quantity: { $sum: "$quantity" },
        //   revenue: { $sum: "$price" },
        // },
        // $project: {
        //   _id: 0,
        //   category: "$_id",
        //   quantity: "$quantity",
        //   revenue: "$revenue",
        // },
      },
    ]);

    console.log("Debug: Result from aggregation", result); // Debug log

    if (result.length === 0) {
      throw new Error("No data found in orderstats");
    }

    res.json(result);
  } catch (error) {
    console.error("Error:", error.message); // Error log
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
