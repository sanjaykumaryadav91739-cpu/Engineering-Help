import User from "../models/user.js";
import bcrypt from "bcrypt";

const loginUser = async (email, password) => {
    // User find karo
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Password verify karo
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Password response me nahi bhejna
    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
};

export { loginUser };