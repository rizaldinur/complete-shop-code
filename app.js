import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import pageNotFound from "./controllers/error.js";
// // import Product from "./models/product.js";
// import User from "./models/user.js";
// import Cart from "./models/cart.js";
// import CartItem from "./models/cart-item.js";
// import Order from "./models/order.js";
// import OrderItem from "./models/order-item.js";
import { getDB, mongoConnect } from "./util/dbconfig.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

//store dummy user data as request
//when request comes through this middleware
app.use(async (req, res, next) => {
  // const user = await User.findByPk(1);
  // req.user = user;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

// // test DB connection
// try {
//   await sequelize.authenticate();
//   console.log("DB Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

// // initialize DB synchronization
// try {
//   //1 to many
//   User.hasMany(Product, { onDelete: "CASCADE" });
//   Product.belongsTo(User);

//   User.hasMany(Order);
//   Order.belongsTo(User);
//   //1 to 1
//   User.hasOne(Cart, { foreignKey: { unique: true } });
//   Cart.belongsTo(User);
//   //many to many
//   Cart.belongsToMany(Product, { through: CartItem });
//   Product.belongsToMany(Cart, { through: CartItem });
//   //n:m Order-Product
//   Order.belongsToMany(Product, { through: OrderItem });
//   Product.belongsToMany(Order, { through: OrderItem });

//   // await sequelize.sync({ force: true });
//   await sequelize.sync();
//   console.log("DB Synced.");
//   const [user, created] = await User.findOrCreate({
//     where: { id: 1 },
//     defaults: {
//       name: "Skibidi",
//       email: "test@test.com",
//     },
//   });
//   console.log("Is User Created? ", created);
//   if (!(await user.getCart())) {
//     await user.createCart();
//   }

//   app.listen(3000, () => {
//     console.log(`server running on http://localhost:3000`);
//   });
// } catch (error) {
//   console.error("Failed to sync DB:", error);
// }

try {
  await mongoConnect();
  console.log("Connected to Mongo Client!");
  app.listen(3000, () => {
    console.log(`server running on http://localhost:3000`);
  });
} catch (error) {
  console.log(error);
}
