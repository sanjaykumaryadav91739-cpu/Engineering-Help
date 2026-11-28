import { z } from "zod";

const createUserSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim(),

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


const loginUserSchema = z.object({
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
export { createUserSchema ,loginUserSchema};