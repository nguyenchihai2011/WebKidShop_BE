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

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
