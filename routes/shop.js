import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as productsControllers from "../controllers/products.js";

const router = express.Router();

router.get("/", productsControllers.getProducts);

export default router;
