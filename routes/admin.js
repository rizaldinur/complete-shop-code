import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as adminControllers from "../controllers/admin.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

// // /admin GET
router.get("/add-product", isAuth, adminControllers.getAddProduct);
router.get("/products", isAuth, adminControllers.getAdminProducts);

// // /admin POST
router.post("/add-product", isAuth, adminControllers.postAddProduct);
router.get("/edit-product/:productId", isAuth, adminControllers.getEditProduct);
router.post(
  "/edit-product/:productId",
  isAuth,
  adminControllers.postEditProduct
);
router.post("/delete-product/", isAuth, adminControllers.deleteProduct);

export default router;
