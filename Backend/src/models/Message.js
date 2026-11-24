
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000
        },

        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

// Load messages in chronological order within a chat.
messageSchema.index({ chatId: 1, createdAt: 1 });

const Message =
    mongoose.models.Message ||
    mongoose.model("Message", messageSchema);

export default Message;