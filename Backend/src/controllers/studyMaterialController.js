
import Material from "../models/Material.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


// ==========================================
// Upload PDF to Cloudinary
// ==========================================
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "engineering-help/study-materials",

                // PDF ko Cloudinary image resource ke roop me upload karna
                resource_type: "image",

                // Public delivery
                type: "upload",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier
            .createReadStream(fileBuffer)
            .pipe(uploadStream);
    });
};


// ==========================================
// Get All Study Materials
// ==========================================
export const getAllMaterials = async (req, res) => {
    try {
        const materials = await Material.find()
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: materials.length,
            materials,
        });
    } catch (error) {
        console.error("Get materials error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch study materials",
        });
    }
};


// ==========================================
// Get Single Study Material
// ==========================================
export const getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id)
            .populate("uploadedBy", "name email");

        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }

        return res.status(200).json({
            success: true,
            material,
        });
    } catch (error) {
        console.error("Get material error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch study material",
        });
    }
};


// ==========================================
// Create Study Material
// ==========================================
export const createMaterial = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            type,
        } = req.body;


        // Required fields validation
        if (!title || !subject || !type) {
            return res.status(400).json({
                success: false,
                message: "Title, subject and type are required",
            });
        }


        // File validation
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Study material file is required",
            });
        }


        // Upload PDF to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);


        // Save material in MongoDB
        const material = await Material.create({
            title,
            description,
            subject,
            type,

            fileUrl: result.secure_url,

            publicId: result.public_id,

            uploadedBy: req.user._id,
        });


        return res.status(201).json({
            success: true,
            message: "Study material uploaded successfully",
            material,
        });

    } catch (error) {
        console.error("Create material error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to upload study material",
        });
    }
};


// ==========================================
// Update Study Material
// ==========================================
export const updateMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);


        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }


        const {
            title,
            description,
            subject,
            type,
        } = req.body;


        // Update text fields
        if (title !== undefined) {
            material.title = title;
        }

        if (description !== undefined) {
            material.description = description;
        }

        if (subject !== undefined) {
            material.subject = subject;
        }

        if (type !== undefined) {
            material.type = type;
        }


        // If new PDF is uploaded
        if (req.file) {

            // Upload new PDF
            const result = await uploadToCloudinary(
                req.file.buffer
            );


            // Delete old PDF
            if (material.publicId) {
                try {
                    await cloudinary.uploader.destroy(
                        material.publicId,
                        {
                            resource_type: "image",
                        }
                    );
                } catch (deleteError) {
                    console.error(
                        "Old Cloudinary file delete error:",
                        deleteError
                    );
                }
            }


            // Save new Cloudinary details
            material.fileUrl = result.secure_url;
            material.publicId = result.public_id;
        }


        await material.save();


        return res.status(200).json({
            success: true,
            message: "Study material updated successfully",
            material,
        });

    } catch (error) {
        console.error("Update material error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update study material",
        });
    }
};


// ==========================================
// Delete Study Material
// ==========================================
export const deleteMaterial = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);


        if (!material) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }


        // Delete PDF from Cloudinary
        if (material.publicId) {
            try {
                await cloudinary.uploader.destroy(
                    material.publicId,
                    {
                        resource_type: "image",
                    }
                );
            } catch (deleteError) {
                console.error(
                    "Cloudinary delete error:",
                    deleteError
                );
            }
        }


        // Delete material from MongoDB
        await Material.findByIdAndDelete(req.params.id);


        return res.status(200).json({
            success: true,
            message: "Study material and Cloudinary file deleted successfully",
        });

    } catch (error) {
        console.error("Delete material error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete study material",
        });
    }
};
