import cloudinary from "../config/cloudinary.js";

const uploadMaterial = (fileBuffer) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "engineering-help/study-material",
                resource_type: "raw",
            },

            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        stream.end(fileBuffer);

    });

};

export default uploadMaterial;