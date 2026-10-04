import express from "express";

import {
    getUsers,
    addUser,
    login,
    updateProfile,
    uploadProfileImage
} from "../controllers/userController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/", addUser);

router.post("/login", login);

router.put("/:id/profile", updateProfile);

router.post(
    "/:id/profile-image",
    upload.single("profileImage"),
    uploadProfileImage
);

export default router;