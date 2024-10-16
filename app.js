import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import pageNotFound from "./controllers/error.js";
import User from "./models/user.js";
// import { getDB, mongoConnect } from "./util/dbconfig.js";
import { mongooseConnect } from "./util/dbconfig.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import Order from "./models/order.js";

config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

// store dummy user data in request object
// when request comes through this middleware
app.use(async (req, res, next) => {
  const user = await User.findById("6711e33c8dde4e1c73e5389a");

  //find User document instance
  //and store in req object as property called 'user'
  //so every incoming request will be funneled through this midleware
  //and can use the current user document instance
  req.user = user;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

try {
  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo Client!");
    console.log("On Database: ", mongoose.connection.name);
  });
  await mongooseConnect();
  app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
  });
} catch (error) {
  console.log(error);
}
