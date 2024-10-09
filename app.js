import path from "path";
import express from "express";
import rootDir from "./util/path.js";
import bodyParser from "body-parser";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import pageNotFound from "./controllers/error.js";
import sequelize from "./util/dbconfig.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

console.log(rootDir);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(pageNotFound);

app.listen(3000, async () => {
  console.log(`server running on http://localhost:3000`);
  try {
    await sequelize.authenticate();
    console.log("DB Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  try {
    await sequelize.sync();
    console.log("DB Synced.");
  } catch (error) {
    console.error("Failed to sync DB:", error);
  }
});
