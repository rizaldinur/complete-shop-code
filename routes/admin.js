import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as adminControllers from "../controllers/admin.js";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", adminControllers.getAddProduct);

router.get("/products", adminControllers.getAdminProducts);

// /admin/add-product => POST
router.post("/add-product", adminControllers.postAddProduct);

router.get("/edit-product/:productId", adminControllers.getEditProduct);

router.post("/edit-product/:productId", adminControllers.postEditProduct);

export default router;
