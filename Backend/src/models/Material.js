import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
            enum: [
                "Notes",
                "PYQ",
                "Study Material",
                "Practice",
                "Assignment",
                "Question Bank",
            ],
        },

        fileUrl: {
            type: String,
            required: true,
        },

        publicId: {
            type: String,
            required: true,
        },

        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

materialSchema.index({
    subject: 1,
    type: 1,
});

materialSchema.index({
    createdAt: -1,
});

const Material = mongoose.model(
    "Material",
    materialSchema
);

export default Material;