const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../modules/admin");

router.get('/', (req,res,next) => {
    Admin.find()
    .exec()
    .then(result => {
        res.status(200).json(result)
    })
    .catch((error) => {
        res.status(500).json({
            error: error
        })
    })
});

router.post("/signup", (req, res, next) => {  
  Admin.find({ username: req.body.username })
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
            const user = Admin({
              _id: req.body._id,
              username: req.body.username,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                return res.status(201).json({
                  message: "User created",
                  username: req.body.userName
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

router.post('/login',(req,res,next) =>{
  Admin.find({username:req.body.username})
      .exec()
      .then(admin => {
          if(admin.length < 1){
              return res.status(401).json({
                  message: 'Auth failed'
              })
          }
          bcrypt.compare(req.body.password,admin[0].password, (err,result) => {
              if(err){
                  return res.status(401).json({
                      message: 'Auth failed'
                  })
              }
              if(result){
                  const token = jwt.sign({
                      username: admin[0].username,
                  }, process.env.JWT_KEY,{
                      expiresIn: "2h"
                  })
                  return res.status(200).json({
                      message: 'Auth successful',
                      token: token
                  })
              }
              res.status(401).json({
                  message:'Auth failed'
              })
          })
      })
      .catch((err) => {
          res.status(500).json({
            error: err,
          });
      })
})  

router.get('/:adminId', async (req,res,next) => {
    const id = req.params.adminId
    await Admin.findById(id)
    .exec()
    .then((doc) => {
      const response = {
        id:doc.id,
        username:doc.username,
        password:doc.password,
        request: {
            type: "GET",
            url: "localhost:3000/admin/" + doc._id
          }
      }
      res.status(200).json(response)
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.patch('/:adminId', async (req, res, next) => {
    try {
      const id = req.params.adminId;
      const updates = req.body;
      const options = { new: true };
      const result = await Admin.findByIdAndUpdate(id, updates, options);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        error:error
      });
    }
});

router.delete('/:adminId', async (req, res, next) => {
    const _id = req.params.adminId;
    try{
      const result = await Admin.findByIdAndDelete(_id);
      if (!result){
        res.status(404).json({
          message: "Admin not found!",
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