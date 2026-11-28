
import express from "express";

import {
    createChat,
    getChats
} from "../controllers/chatController.js";

const router = express.Router();

// Create a conversation
router.post("/", createChat);

// Get logged-in user's conversations
router.get("/", getChats);

export default router;
