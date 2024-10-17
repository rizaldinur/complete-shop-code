import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import pageNotFound from "./controllers/error.js";
// import User from "./models/user.js";
import { getDB, mongoConnect } from "./util/dbconfig.js";
import mongoose from "mongoose";
import { config } from "dotenv";

config();

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

//store dummy user data in request object
//when request comes through this middleware
// app.use(async (req, res, next) => {
//   const user = await User.findById("670f842d2eae2212b75d5656");

//   //create User instance using the data from db
//   //and store in req object as property called 'user'
//   //so every incoming request will be funneled through this midleware
//   //and can use the current user of 'req.user'
//   req.user = new User(user.name, user.email, user.cart, user._id);
//   next();
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

try {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Connected to Mongo Client!");
  app.listen(3000, () => {
    console.log(`server running on http://localhost:3000`);
  });
} catch (error) {
  console.log(error);
}
