const express = require("express");
const router = express.Router();

const menuController = require("../controller/productController");
// const verifyAdmin = require("../middleware/verifyAdmin")

//get all menu
router.get("/", menuController.getAllMenuItems);
router.post("/", menuController.postItemMenu);
router.delete("/:id", menuController.deletedMenuItem);
router.get("/:id", menuController.singleMenuItem);
router.patch("/:id", menuController.updateMenuItem);
router.get("/related", menuController.getRelatedMenuItems);


module.exports = router;
