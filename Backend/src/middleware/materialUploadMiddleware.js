import multer from "multer";

const storage = multer.memoryStorage();

const materialUpload = multer({
    storage,

    limits: {
        fileSize: 20 * 1024 * 1024, // 20 MB
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "application/pdf",

            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only PDF, DOC, DOCX, PPT and PPTX files are allowed"
                ),
                false
            );
        }
    },
});

export default materialUpload;