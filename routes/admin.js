import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as productsControllers from "../controllers/products.js";

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", productsControllers.getAddProduct);

// /admin/add-product => POST
router.post("/add-product", productsControllers.postAddProduct);

export default router;
