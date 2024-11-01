import path from "path";
import express from "express";
import rootDir from "../util/path.js";
import * as adminControllers from "../controllers/admin.js";
import { isAuth, currentUserProduct } from "../middleware/middleware.js";
import { check, body } from "express-validator";

const router = express.Router();

// // /admin GET
router.get("/add-product", isAuth, adminControllers.getAddProduct);
router.get("/products", isAuth, adminControllers.getAdminProducts);
router.get(
  "/edit-product/:productId",
  isAuth,
  currentUserProduct,
  adminControllers.getEditProduct
);

// // /admin POST
router.post(
  "/add-product",
  [
    body("title")
      .isLength({ max: 100 })
      .withMessage(
        "Title must be 100 characters or less containing no special symbols."
      )
      .notEmpty()
      .withMessage("Title must not be empty.")
      .trim(),
    body("imageUrl", "Invalid image URL.").isURL(),
    body("price").notEmpty().withMessage("Price must not be empty."),
    body("description")
      .isLength({ min: 5, max: 500 })
      .withMessage(
        "Description must be at least 5 or at most 500 characters long."
      )
      .trim(),
  ],
  isAuth,
  adminControllers.postAddProduct
);
router.post(
  "/edit-product/:productId",
  [
    body("title")
      .isLength({ max: 100 })
      .withMessage("Title must be 100 characters or less.")
      .notEmpty()
      .withMessage("Title must not be empty.")
      .trim(),
    body("imageUrl", "Invalid image URL.").isURL(),
    body("price").notEmpty().withMessage("Price must not be empty."),
    body("description")
      .isLength({ min: 5, max: 500 })
      .withMessage(
        "Description must be at least 5 or at most 500 characters long."
      )
      .trim(),
  ],
  isAuth,
  currentUserProduct,
  adminControllers.postEditProduct
);
router.post(
  "/delete-product/",
  isAuth,
  currentUserProduct,
  adminControllers.deleteProduct
);

export default router;
