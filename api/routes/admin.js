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