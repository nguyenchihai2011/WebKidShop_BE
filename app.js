const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const adminRoute = require("./api/routes/admins");
const categoryRoute = require("./api/routes/categories");
const productTypeRoute = require("./api/routes/productTypes");
const brandRoute = require("./api/routes/brands");
const promotionRoute = require("./api/routes/promotion");
const productRoute = require("./api/routes/products");
const usersRoute = require("./api/routes/users");
const addressRoute = require("./api/routes/userAddress");
const cartRoute = require("./api/routes/cartItems");
const orderRoute = require("./api/routes/orders");
const staffRoute = require("./api/routes/staffs");

const app = express();

// Connect Database
connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//API
app.use(cors());
app.use("/api/admin", adminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/productType", productTypeRoute);
app.use("/api/brand", brandRoute);
app.use("/api/promotion", promotionRoute);
app.use("/api/product", productRoute);
app.use("/api/user", usersRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", orderRoute);
app.use("/api/staff", staffRoute);

// Connect to MongoDB and schedule promotion cleaner
const mongoose = require("mongoose");
const schedule = require("node-schedule");
const Promotion = require("./api/models/promotion");

mongoose
  .connect("mongodb+srv://admin:admin@cluster0.bb2dwct.mongodb.net/WebKidShop?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.log(err));

const job = schedule.scheduleJob("0 0 * * *", async function () {
  console.log("Running promotion cleaner");
  const now = new Date();
  const promotionsToDelete = await Promotion.find({
    endDay: { $lte: now },
  });
  console.log(`Found ${promotionsToDelete.length} promotions to delete`);
  await Promise.all(promotionsToDelete.map((p) => p.remove()));
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
