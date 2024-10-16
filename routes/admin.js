import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as adminControllers from "../controllers/admin.js";

const router = express.Router();

// // /admin GET
router.get("/add-product", adminControllers.getAddProduct);
router.get("/products", adminControllers.getAdminProducts);

// // /admin POST
router.post("/add-product", adminControllers.postAddProduct);
router.get("/edit-product/:productId", adminControllers.getEditProduct);
router.post("/edit-product/:productId", adminControllers.postEditProduct);
router.post("/delete-product/", adminControllers.deleteProduct);

export default router;
