import express from "express";

import {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
} from "../controllers/studyMaterialController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import materialUpload from "../middleware/materialUploadMiddleware.js";

const router = express.Router();

// Anyone logged in can read study material
router.get(
    "/",
    authMiddleware,
    getAllMaterials
);

router.get(
    "/:id",
    authMiddleware,
    getMaterialById
);

// Only admin can create
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    materialUpload.single("file"),
    createMaterial
);

// Only admin can update
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    materialUpload.single("file"),
    updateMaterial
);

// Only admin can delete
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteMaterial
);

export default router;