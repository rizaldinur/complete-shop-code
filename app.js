import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import pageNotFound from "./controllers/error.js";
import User from "./models/user.js";
// import { getDB, mongoConnect } from "./util/dbconfig.js";
import { mongooseConnect } from "./util/dbconfig.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import Order from "./models/order.js";
import session from "express-session";

const MongoDBStore = (await import("connect-mongodb-session")).default;

config();

const app = express();
const store = new MongoDBStore(session)({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
//express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
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
