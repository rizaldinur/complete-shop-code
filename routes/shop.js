import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as shopController from "../controllers/shop.js";

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);
// // router.get("/checkout", shopController.getCheckout);
router.get("/orders", shopController.getOrders);

router.post("/create-order", shopController.postOrder);
router.post("/cart", shopController.postCart);
router.post("/cart-delete-item", shopController.postDeleteCartItem);

export default router;
