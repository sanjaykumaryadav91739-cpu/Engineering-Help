import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import adminMiddleware from "./middleware/adminMiddleware.js";
import studyMaterialRoutes from "./routes/studyMaterialRoutes.js";

const app = express();

app.use(
    cors({
        origin: "http://127.0.0.1:5501",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

app.use(express.json());

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Engineering Help Backend Connected 🚀"
    });
});

//User routes

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Engineering Help API is running 🚀"
    });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);
app.get("/api/v1/auth/me", authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authentication successful",
        user: req.user
    });
});





app.use(
    "/api/v1/materials",
    studyMaterialRoutes
);

export default app;