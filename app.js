const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const categoryRoute = require("./api/routes/category");
const productTypeRoute = require("./api/routes/productType");
const brandRoute = require("./api/routes/brand");
const promotionRoute = require("./api/routes/promotion");

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
app.get("/", (req, res) => res.send("Hello world"));
app.use("/api/category", categoryRoute);
app.use("/api/productType", productTypeRoute);
app.use("/api/brand", brandRoute);
app.use("/api/promotion", promotionRoute);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
