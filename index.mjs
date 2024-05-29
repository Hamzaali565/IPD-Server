import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

import Authentication from "./Routes/Authentications/Auth.mjs";
import Auth from "./Routes/Authentications/Auth.mjs";
import Prod from "./API/Product/Product.mjs";
mongoose.set("strictQuery", false);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://ipd-model.vercel.app"],
    credentials: true,
  })
);
app.use("/api/v1", Authentication);
app.use("/api/v1", Auth);
app.use("/api/v1", Prod);

const __dirname = path.resolve();
app.use("/", express.static(path.join(__dirname, "./Frontend/build")));
app.use("*", express.static(path.join(__dirname, "./Frontend/build")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const MONGODB_URI = process.env.MONGODB_URI;

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(MONGODB_URI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Database is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run just before the app is closing
  console.log("app is terminating");
  mongoose.connection.close(); // Remove the callback function here
  console.log("Mongoose default connection closed");
  process.exit(0);
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////
