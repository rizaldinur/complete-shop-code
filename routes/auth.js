import express from "express";
import * as authController from "../controllers/auth.js";
import { check, body } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { saveSession } from "../util/helper.js";

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error(
            "E-mail already exists, please enter a different one."
          );
        }
        return true;
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);
router.post(
  "/login",
  body("email", "Invalid email or password.")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw Error();
      }
      req.user = user;
    }),
  body("password", "Invalid email or password.")
    .trim()
    .custom(async (value, { req }) => {
      const password = value;
      if (!req.user) {
        return;
      }
      const user = req.user;
      const hashedPassword = user.password;
      const isValid = await bcrypt.compare(password, hashedPassword);
      if (!isValid) {
        throw Error();
      }
      req.session.isLoggedIn = true;
      req.session.userId = user._id;
      await saveSession(req);
    }),
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

export default router;
