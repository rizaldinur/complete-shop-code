import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as shopController from "../controllers/shop.js";
import { isAuth } from "../middleware/middleware.js";

const router = express.Router();

router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", isAuth, shopController.getCart);
// // router.get("/checkout", shopController.getCheckout);
router.get("/orders", isAuth, shopController.getOrders);
router.get("/orders/:orderId", isAuth, shopController.getInvoice);

router.post("/create-order", isAuth, shopController.postOrder);
router.post("/cart", isAuth, shopController.postCart);
router.post("/cart-delete-item", isAuth, shopController.postDeleteCartItem);

export default router;
