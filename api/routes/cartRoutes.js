const express = require("express");
const router = express.Router();

const cartsController = require("../controller/cartsController");
const verifyToken = require("../middleware/verifyToken");

//get carts
router.get("/", verifyToken, cartsController.getCartByEmail);
router.post("/", cartsController.addToCart);
router.delete("/:id", cartsController.deleteCart);
router.put("/:id", cartsController.updateCart);
router.get("/:id", cartsController.singleCart);
router.delete("/all", verifyToken, cartsController.deleteAllFromCart);

module.exports = router;
