
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user._id;

        if (!chatId || !mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Valid chat ID is required"
            });
        }

        if (typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message text is required"
            });
        }

        if (text.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 5000 characters"
            });
        }

        // Ensure the sender belongs to this chat
        const chat = await Chat.findOne({
            _id: chatId,
            participants: senderId,
            isGroup: false
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or access denied"
            });
        }

        const message = await Message.create({
            chatId: chat._id,
            sender: senderId,
            text: text.trim(),
            readBy: [senderId]
        });

        // Update the chat's latest message and activity time
        chat.lastMessage = message._id;
        await chat.save();

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name email profileImage");

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: populatedMessage
        });
    } catch (error) {
        console.error("Send message error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
};

// Get messages for a chat
export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        if (!mongoose.isValidObjectId(chatId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chat ID"
            });
        }

        // Only participants can access chat history
        const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
            isGroup: false
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or access denied"
            });
        }

        const messages = await Message.find({ chatId: chat._id })
            .populate("sender", "name email profileImage")
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error("Get messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages"
        });
    }
};
