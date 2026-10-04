import { z } from "zod";

const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters")
});

export { loginSchema };