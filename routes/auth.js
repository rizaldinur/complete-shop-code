import express from "express";
import * as authController from "../controllers/auth.js";
const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);

export default router;
