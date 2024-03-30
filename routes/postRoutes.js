import express from "express";
import {
  createPost,
  getPost,
  getFeedPosts,
  deletePost,
  getUserPosts,
  likeUnlikePost,
  replyPost,
} from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/feed", authMiddleware, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);

router.post("/create", authMiddleware, createPost);
router.delete("/:id", authMiddleware, deletePost);

router.put("/like/:postId", authMiddleware, likeUnlikePost);
router.put("/reply/:postId", authMiddleware, replyPost);

export default router;
