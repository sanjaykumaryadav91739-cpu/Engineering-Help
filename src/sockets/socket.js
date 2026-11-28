
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "https://engineering-help-frontend.vercel.app",
                "http://127.0.0.1:5500",
                "http://localhost:5500",
                "http://127.0.0.1:5501",
                "http://localhost:5501"
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Authenticate every Socket.IO connection
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication token is required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            if (!decoded.userId) {
                return next(new Error("Invalid authentication token"));
            }

            const user = await User.findById(decoded.userId)
                .select("_id");

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.data.userId = user._id.toString();

            next();
        } catch (error) {
            next(new Error("Invalid or expired token"));
        }
    });

    // Handle authenticated connections
    io.on("connection", (socket) => {
        const userId = socket.data.userId;

        // Each user joins their private room
        socket.join(`user:${userId}`);

        console.log(`User connected: ${userId}`);

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${userId}`);
        });
    });

    return io;
};
