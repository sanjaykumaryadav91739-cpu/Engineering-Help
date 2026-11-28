
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import studyMaterialRoutes from "./routes/studyMaterialRoutes.js";

import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

app.use(
    cors({
        origin: [
            "https://engineering-help-frontend.vercel.app",
            "http://127.0.0.1:5501",
            "http://localhost:5501",
            "http://127.0.0.1:5500",
            "http://localhost:5500",
            
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);
app.use(express.json());

// Health check
app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Engineering Help Backend Connected 🚀"
    });
});

// User routes
app.use("/api/v1/users", userRoutes);

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Engineering Help API is running 🚀"
    });
});

// Authentication routes
app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/auth/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: req.user
    });
});

// Study material routes
app.use("/api/v1/materials", studyMaterialRoutes);

// Chat routes
app.use("/api/v1/chats", authMiddleware, chatRoutes);

// Message routes
app.use("/api/v1/messages", authMiddleware, messageRoutes);

export default app;
