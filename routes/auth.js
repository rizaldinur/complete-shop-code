import express from "express";
import * as authController from "../controllers/auth.js";
const router = express.Router();

router.get("/login", authController.getLogin);

export default router;
