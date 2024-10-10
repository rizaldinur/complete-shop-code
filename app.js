import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import pageNotFound from "./controllers/error.js";
import sequelize from "./util/dbconfig.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import Cart from "./models/cart.js";
import CartItem from "./models/cart-item.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

//store dummy user data as request
//when request comes through this middleware
app.use(async (req, res, next) => {
  const user = await User.findByPk(1);
  req.user = user;
  // console.log(req.user);
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

// test DB connection
try {
  await sequelize.authenticate();
  console.log("DB Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// initialize DB synchronization
try {
  //1 to many
  User.hasMany(Product);
  Product.belongsTo(User);
  //1 to 1
  User.hasOne(Cart);
  Cart.belongsTo(User);
  //many to many
  Cart.belongsToMany(Product, { through: CartItem });
  Product.belongsToMany(Cart, { through: CartItem });

  await sequelize.sync();
  console.log("DB Synced.");
  const [user, created] = await User.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: "Skibidi",
      email: "test@test.com",
    },
  });
  console.log("Is User Created? ", created);

  app.listen(3000, () => {
    console.log(`server running on http://localhost:3000`);
  });
} catch (error) {
  console.error("Failed to sync DB:", error);
}
