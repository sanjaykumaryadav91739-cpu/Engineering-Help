import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const getAllUsers = async () => {
    const users = await User.find().select("-password");

    return users;
};

const createUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    const userResponse = user.toObject();

    delete userResponse.password;

    return userResponse;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    const userResponse = user.toObject();

    delete userResponse.password;

    return {
        user: userResponse,
        token
    };
};

const updateUserProfile = async (userId, profileData) => {

    const updateData = {};

    if (profileData.phone !== undefined) {
        updateData.phone = profileData.phone;
    }

    if (profileData.address !== undefined) {
        updateData.address = profileData.address;
    }

    if (profileData.profileImage !== undefined) {
        updateData.profileImage = profileData.profileImage;
    }

    const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
            new: true,
            runValidators: true
        }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export {
    getAllUsers,
    createUser,
    loginUser,
    updateUserProfile
};