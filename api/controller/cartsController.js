const Carts = require("../models/Carts");

const getCartByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const query = { email: email };
    const result = await Carts.find(query).sort({ createdAt: -1 }).populate('productItemId'); // Corrected field name to 'createdAt'
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//add to cart
const addToCart = async (req, res) => {
  const { productItemId, name, recipe, image, price, email, quantity } = req.body;

  try {
    // Kiểm tra sản phẩm đã tồn tại
    const existingCartItem = await Carts.findOne({ email, productItemId });
    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Sản phẩm này đã có trong giỏ hàng của bạn rồi." });
    }

    // Thêm sản phẩm mới vào giỏ hàng
    const cartItem = await Carts.create({
      productItemId,
      name,
      recipe,
      image,
      price,
      email,
      quantity,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete cart
const deleteCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const deletedCart = await Carts.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res
        .status(404) // Mã 404 cho trường hợp không tìm thấy sản phẩm
        .json({ message: "Không tìm thấy sản phẩm để xoá" });
    }

    res.status(200).json({ message: "Xoá sản phẩm này thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message }); // Thay 5000 bằng 500
  }
};

//update cart
const updateCart = async (req, res) => {
  const cartId = req.params.id;
  const { productItemId, name, recipe, image, price, email, quantity } = req.body;
  try {
    const updatedCart = await Carts.findByIdAndUpdate(
      cartId,
      { productItemId, name, recipe, image, price, email, quantity },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      res.status(404).json({ message: "Không tìm thấy sản phẩm để sửa" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get single product
const singleCart = async (req, res) => {
  const cartId = req.params.id;
  try {
    const cartItem = await Carts.findById(cartId);
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllFromCart = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await Carts.deleteMany({ email: email });
    res
      .status(200)
      .json({
        success: true,
        message: "All items for the user deleted.",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  getCartByEmail,
  addToCart,
  deleteCart,
  updateCart,
  singleCart,
  deleteAllFromCart,
};
