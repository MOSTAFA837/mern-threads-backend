import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", authMiddleware, getConversations);
router.post("/", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getMessages);

export default router;
