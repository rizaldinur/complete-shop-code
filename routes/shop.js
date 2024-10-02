import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import { products } from "./admin.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  const product = products;
  res.render("shop", {
    prods: product,
    pageTitle: "Shop",
    path: "/",
    hasProducts: product.length > 0,
    activeShop: true,
    productCSS: true,
  });
});

export default router;
