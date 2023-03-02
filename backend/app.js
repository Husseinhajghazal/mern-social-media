require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const NewError = require("./models/new-error");
const fs = require("fs");
const path = require("path");
const postsRoutes = require("./routes/posts-routes");
const usersRoutes = require("./routes/users-routes");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

app.use(express.json());

app.use("/posts", postsRoutes);
app.use("/users", usersRoutes);

app.use((req, res, next) => {
  return next(new NewError("Could not find this route.", 404));
});

app.use(async (error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qb0atmw.mongodb.net/${process.env.MONGO_DATABASE}`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });
