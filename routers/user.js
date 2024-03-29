const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exsists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  hash: hash,
                  message: "User Created"
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

// router.post("/signup", (req, res, next) => {
//   const user = new User({
//     _id: new mongoose.Types.ObjectId(),
//     email: req.body.email,
//     password: req.body.password
//   });
//   user
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "User Created"
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

router.post("/login", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            "secret",
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth Success",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth Failed"
        });
      });
    })
    .catch();
});

router.delete("/:UserId", (req, res, next) => {
  User.remove({ id: req.params.UserId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User Delted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
