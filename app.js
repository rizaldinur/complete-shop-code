import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import { get404, get500 } from "./controllers/error.js";
import User from "./models/user.js";
// import { getDB, mongoConnect } from "./util/dbconfig.js";
import { mongooseConnect } from "./util/dbconfig.js";
import mongoose from "mongoose";
import { config } from "dotenv";
import Order from "./models/order.js";
import session from "express-session";
import { csrfSync } from "csrf-sync";
import flash from "connect-flash";
import multer from "multer";

const MongoDBStore = (await import("connect-mongodb-session")).default;

config();

const app = express();
const store = new MongoDBStore(session)({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});

const { generateToken, csrfSynchronisedProtection } = csrfSync({
  getTokenFromRequest: (req) => {
    return req.headers["csrf-token"] || req.body["_csrf"];
  }, // Used to retrieve the token submitted by the user in a form
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") +
        "-" +
        file.originalname.replace(/\s+/g, "_")
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
//express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(rootDir, "public")));
app.use("/images", express.static(path.join(rootDir, "images")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfSynchronisedProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = generateToken(req);
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(flash());

//routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get("/500", get500);
app.use(get404);

// global express error handling middleware here
app.use((error, req, res, next) => {
  console.log(error);

  res.status(500).render("500", {
    pageTitle: "Internal Failure",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

try {
  mongoose.connection.on("connected", () => {
    console.log("Connected to Mongo Client!");
    console.log("On Database: ", mongoose.connection.name);
    app.listen(3000, () => {
      console.log(`Server running on http://localhost:3000`);
    });
  });
  mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
  });
  await mongooseConnect();
} catch (error) {
  console.log(error);
}
