import {
    getAllUsers,
    createUser,
    loginUser,
    updateUserProfile
} from "../services/userService.js";

import {
    createUserSchema,
    loginUserSchema 
} from "../validators/userValidator.js";

import uploadImage from "../services/fileService.js";


const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

const addUser = async (req, res) => {
    try {
        const result = createUserSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });
        }

        const user = await createUser(result.data);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        });
    } catch (error) {
        console.error("Create user error:", error);

        if (error.message === "User with this email already exists") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create user"
        });
    }
};

const login = async (req, res) => {
    try {
        const validationResult =
            loginUserSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationResult.error.issues
            });
        }

        const { email, password } = validationResult.data;

        const loginResult = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: loginResult.user,
            token: loginResult.token
        });

    } catch (error) {
        console.error("Login error:", error);

        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await updateUserProfile(
            id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Update profile error:", error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

const uploadProfileImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required"
            });
        }

        const result = await uploadImage(req.file.buffer);

        const user = await updateUserProfile(id, {
            profileImage: result.secure_url
        });

        res.status(200).json({
            success: true,
            message: "Profile image uploaded successfully",
            profileImage: result.secure_url,
            user
        });

    } catch (error) {
        console.error("Profile image upload error:", error);

        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to upload profile image"
        });
    }
};



export { 
    getUsers, 
    addUser,
    login ,
    updateProfile,
    uploadProfileImage
};