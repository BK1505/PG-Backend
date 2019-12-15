const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const guestRoutes = require("./routers/guests");
const userRouter = require("./routers/user");

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

mongoose.connect("mongodb://localhost/guests", () => {
  console.log("MongoDB Connected");
});

app.use("/guests", guestRoutes);
app.use("/user", userRouter);

module.exports = app;
