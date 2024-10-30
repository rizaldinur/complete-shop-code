import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as adminControllers from "../controllers/admin.js";
import { isAuth, isProductCreator } from "../middleware/middleware.js";

const router = express.Router();

// // /admin GET
router.get("/add-product", isAuth, adminControllers.getAddProduct);
router.get("/products", isAuth, adminControllers.getAdminProducts);
router.get(
  "/edit-product/:productId",
  isAuth,
  isProductCreator,
  adminControllers.getEditProduct
);

// // /admin POST
router.post("/add-product", isAuth, adminControllers.postAddProduct);
router.post(
  "/edit-product/:productId",
  isAuth,
  isProductCreator,
  adminControllers.postEditProduct
);
router.post(
  "/delete-product/",
  isAuth,
  isProductCreator,
  adminControllers.deleteProduct
);

export default router;
