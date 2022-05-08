const express = require("express");
const mongoose = require("mongoose");
const { USER, PASSWORD, CLUSTER, DB } = require("./const");

const app = express();

mongoose.connect(
  `mongodb+srv://${USER}:${PASSWORD}@${CLUSTER}.m0uau.mongodb.net/${DB}?retryWrites=true&w=majority`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Mongo Connected successfully");
});

app.use(express.json());

const routers = require("./routers/Router");
app.use("/test", routers);

app.listen(9000, function (res, req) {
  console.log("Server is Running...");
});
