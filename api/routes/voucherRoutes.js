const express = require("express");
const {
  getAllVouchers,
  createVoucher,
  getSingleVoucher,
  updateVoucher,
  deleteVoucher,
  validateVoucher,
  useVoucher
} = require("../controller/voucherController");

const router = express.Router();

// Get all vouchers
router.get("/", getAllVouchers);

// Create a new voucher
router.post("/", createVoucher);

router.post("/validate-voucher", validateVoucher);

router.post("/use", useVoucher);



// Get a single voucher by ID
router.get("/:id", getSingleVoucher);

// Update a voucher by ID
router.put("/:id", updateVoucher);

// Delete a voucher by ID
router.delete("/:id", deleteVoucher);

module.exports = router;
