const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../modules/user");

router.get("/", (req, res, next) => {
  User.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

router.get("/:userId", async (req, res, next) => {
  const id = req.params.userId;
  await User.findById(id)
    .exec()
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        console.log(req.body.password, user[0].password);
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "2h",
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            userId: user[0]._id,
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user);
      if (user.length >= 1) {
        return res.status(422).json({
          message: "Mail exists!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = User({
              _id: new mongoose.Types.ObjectId(),
              userName: req.body.userName,
              phoneNumber: req.body.phoneNumber,
              email: req.body.email,
              password: hash,
              extra: {
                payment: "false",
                score: 0,
                levelsWord: 0,
                levelsTest: 0,
              },
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                return res.status(201).json({
                  message: "User created",
                  username: req.body.userName,
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});
router.patch("/:userId", async (req, res, next) => {
  try {
    const id = req.params.userId;
    const updates = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(id, updates, options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
router.delete("/:userId", (req, res, next) => {
  User.findByIdAndDelete({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
module.exports = router;
