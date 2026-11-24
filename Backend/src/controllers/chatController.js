
import mongoose from "mongoose";
import Chat from "../models/Chat.js";
import User from "../models/user.js";

// Create a one-to-one chat
export const createChat = async (req, res) => {
    try {
        const { participantId } = req.body;
        const currentUserId = req.user._id;

        if (!participantId) {
            return res.status(400).json({
                success: false,
                message: "Participant ID is required"
            });
        }

        if (!mongoose.isValidObjectId(participantId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid participant ID"
            });
        }

        if (currentUserId.toString() === participantId) {
            return res.status(400).json({
                success: false,
                message: "You cannot create a chat with yourself"
            });
        }

        const participant = await User.findById(participantId);

        if (!participant) {
            return res.status(404).json({
                success: false,
                message: "Participant not found"
            });
        }

        // Reuse an existing one-to-one chat if available
        let chat = await Chat.findOne({
            isGroup: false,
            participants: {
                $all: [currentUserId, participantId],
                $size: 2
            }
        }).populate(
            "participants",
            "name email profileImage"
        );

        if (chat) {
            return res.status(200).json({
                success: true,
                message: "Chat already exists",
                chat
            });
        }

        chat = await Chat.create({
            participants: [currentUserId, participantId],
            isGroup: false
        });

        chat = await Chat.findById(chat._id).populate(
            "participants",
            "name email profileImage"
        );

        return res.status(201).json({
            success: true,
            message: "Chat created successfully",
            chat
        });
    } catch (error) {
        console.error("Create chat error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create chat"
        });
    }
};

// Get all chats of the logged-in user
export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            participants: req.user._id
        })
            .populate(
                "participants",
                "name email profileImage"
            )
            .populate({
                path: "lastMessage",
                select: "text sender createdAt"
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json({
            success: true,
            count: chats.length,
            chats
        });
    } catch (error) {
        console.error("Get chats error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch chats"
        });
    }
};
