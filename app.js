const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const wordsRoutes = require("./api/routes/addwords");
const adminRoutes = require("./api/routes/admin");

mongoose.connect(
  "mongodb+srv://Anvarjon:GeneralDB@general.w4e9l2e.mongodb.net/?retryWrites=true&w=majority"
);

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/uploads',express.static('uploads'))


app.use((req, res, next) => {
  res.header("Acces-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin, X-Requested-With, Control-Type, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Acces-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/admin/addwords", wordsRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});
module.exports = app;

