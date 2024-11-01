import express from "express";
import * as authController from "../controllers/auth.js";
import { check, body } from "express-validator";
const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

export default router;
