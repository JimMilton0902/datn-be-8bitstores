const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.port || 6001;
require("dotenv").config();
var jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRECT_KEY);
const mongoose = require("mongoose");

//middle ware
app.use(cors());

app.use(express.json());

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rdlhu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

mongoose.connection.on("connected", () => {
  console.log("Kết nối MongoDB thành công.");
});

mongoose.connection.on("error", (error) => {
  console.log("error server:" + error);
});

//jwt authentications
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const secretKey = process.env.ACCESS_TOKEN_SECRET; // Lấy secret key từ biến môi trường

  if (!secretKey) {
    return res.status(500).send("Missing secret key");
  }

  try {
    var token = jwt.sign(user, secretKey, { expiresIn: "1hr" });
    res.send({ token });
  } catch (error) {
    console.error("Lỗi tạo mã thông báo token:", error);
    res.status(500).send("Lỗi tạo mã thông báo token");
  }
});
app.post("/create-payment-intent", async (req, res) => {
  const { cartTotals } = req.body; // Số tiền VNĐ từ frontend
  const exchangeRate = 25405; // Tỷ giá VNĐ/USD (bạn có thể lấy từ API bên ngoài)

  if (!cartTotals || cartTotals <= 0) {
    return res.status(400).send({ error: "Số tiền không hợp lệ." });
  }

  try {
    // Chuyển đổi từ VNĐ sang USD (sang đơn vị cents)
    const amountInUSD = ((cartTotals / exchangeRate) * 100); // Làm tròn để tránh lỗi số học

    // Tạo PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInUSD, // Số tiền USD (cents)
      currency: "usd", // Loại tiền tệ
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Lỗi khi tạo PaymentIntent:", error);
    res.status(500).send({ error: "Không thể tạo PaymentIntent" });
  }
});

const menuRoutes = require("./api/routes/MenuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRouter = require("./api/routes/userRouter");
const paymentRoutes = require("./api/routes/paymentRoutes");
const adminStats = require("./api/routes/adminStats");
const orderStats = require("./api/routes/orderStats");
const blogRoutes = require("./api/routes/blogRoutes");
const voucherRoutes = require("./api/routes/voucherRoutes");
const categoriesRouter = require("./api/routes/categoriesRoutes");
const voucherRouter = require("./api/routes/voucherRoutes");

app.use("/menu", menuRoutes);
app.use("/cart", cartRoutes);
app.use("/users", userRouter);
app.use("/payments", paymentRoutes);
app.use("/adminstats", adminStats);
app.use("/orderstats", orderStats);
app.use("/blog", blogRoutes);
app.use("/voucher", voucherRoutes);
app.use("/categories", categoriesRouter);
app.use("/vouchers", voucherRouter);

app.get("/", async (req, res) => {
  res.send("hello worlds");
});

app.listen(port, () => {
  console.log(`Đang chạy port: ${port}`);
});
