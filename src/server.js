
import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initializeSocket } from "./sockets/socket.js";
import { setIO } from "./sockets/socketManager.js";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        // Connect MongoDB first
        await connectDB();

        // Create HTTP server
        const httpServer = createServer(app);

        // Initialize Socket.IO
        //initializeSocket(httpServer);
        // Initialize Socket.IO
        const io = initializeSocket(httpServer);
            
        // Register Socket.IO instance globally for backend modules
        setIO(io);

        // Start server
        httpServer.listen(PORT, () => {
            console.log(
                `Engineering Help Backend running on port ${PORT}`
            );
            console.log("Socket.IO server initialized successfully");
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
