
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            }
        ],

        isGroup: {
            type: Boolean,
            default: false
        },

        groupName: {
            type: String,
            trim: true,
            default: ""
        },

        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: null
        }
    },
    {
        timestamps: true
    }
);

chatSchema.index({ participants: 1, updatedAt: -1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
