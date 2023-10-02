const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

const Product = require("../modules/product");

router.post("/", upload.single("productImage"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })
  product
    .save()
    .then((result) => {
      res.status(200).json({
        massage: "Successfully!",
        createdProduct: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price_id price productImage")
    .exec()
    .then((docs) => {
        const response = {
          count: docs.length,
          products: docs.map(doc => {
              return {
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage,
                _id:doc._id,
                request: {
                  type: "GET",
                  url: "localhost:3000/products/" + doc._id
                }
              }
          })
        }
        res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productId", async (req, res, next) => {
  const id = req.params.productId;
  await Product.findById(id)
    .select("name price_id price productImage")
    .exec()
    .then((doc) => {
      const response = {
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          _id:doc._id,
          request: {
            type: "GET",
            url: "localhost:3000/products/" + doc._id
          }
      }
      res.status(200).json(response)
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    const updates = req.body;
    const options = { new: true };

    const result = await Product.findByIdAndUpdate(id, updates, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json();
  }
});

router.delete("/:productId", async (req, res, next) => {
  const _id = req.params.productId;
  console.log(_id);
  try {
    const result = await Product.findByIdAndDelete(_id);
    if (!result) {
      res.status(404).json({
        message: "Product not found!",
      });
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
module.exports = router;
