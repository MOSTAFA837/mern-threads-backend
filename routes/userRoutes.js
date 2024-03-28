import express from "express";
import {
  signup,
  login,
  logout,
  followUnfollow,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/follow/:id", authMiddleware, followUnfollow);

export default router;
