const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const guestRoutes = require("./routers/guests");

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose.connect("mongodb://localhost/guests", () => {
  console.log("MongoDB Connected");
});

app.use("/guests", guestRoutes);

module.exports = app;
