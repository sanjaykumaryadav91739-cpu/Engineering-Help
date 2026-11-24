
import express from "express";

import {
    sendMessage,
    getMessages
} from "../controllers/messageController.js";

const router = express.Router();

// Send a message
router.post("/", sendMessage);

// Get messages for a conversation
router.get("/:chatId", getMessages);

export default router;
