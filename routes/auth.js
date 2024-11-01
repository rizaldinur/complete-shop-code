import express from "express";
import * as authController from "../controllers/auth.js";
import { check } from "express-validator";
const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.get("/reset", authController.getReset);
router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email"),
  authController.postSignup
);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post("/reset", authController.postReset);
router.post("/new-password", authController.postNewPassword);

export default router;
