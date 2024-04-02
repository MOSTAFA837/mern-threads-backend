import express from "express";
import {
  signup,
  login,
  logout,
  followUnfollow,
  update,
  getUserProfile,
  getSuggestedUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggested", authMiddleware, getSuggestedUser);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/follow/:id", authMiddleware, followUnfollow);
router.put("/update/:id", authMiddleware, update);

export default router;
