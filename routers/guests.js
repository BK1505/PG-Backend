const express = require("express");
const router = express.Router();
const multer = require("multer");
const guests = require("../models/guests");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 15 },
  fileFilter: fileFilter
});

router.get("/", (req, res, next) => {
  guests
    .find()
    .exec()
    .then(docs => {
      res.status(200).json({
        message: "Guests List",
        Doc: docs
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:gid", (req, res, next) => {
  const id = req.params.gid;
  guests
    .findById(id)
    .exec()
    .then(docs => {
      if (docs) {
        res.status(200).json({
          message: "Guests details",
          Doc: docs
        });
      } else {
        res.status(404).json({
          message: "No guest found of given ID"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post("/", upload.single("image"), (req, res, next) => {
  const guest = new guests({
    name: req.body.name,
    address: req.body.address,
    contact: req.body.contact,
    image: req.file.path
  });
  guest
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Guest details saved"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.patch("/", (req, res, next) => {
  res.status(200).json({
    message: "guest update"
  });
});

router.delete("/:gid", (req, res, next) => {
  guests
    .remove({ _id: req.params.gid })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Guest details removed"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
