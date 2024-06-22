import jwt from "jsonwebtoken";
import { userSchema } from "../../database/models/user-model";  // Adjust path based on your structure
import mongoose from "mongoose";

// General token verification
export const verifyToken = async (req) => {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) return null;

        const token = authHeader.split(" ")[1];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URL);
        }

        const user = await userSchema.findById(decoded.id);
        if (user) {
            return user;
        }
        return null;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
};

// Admin verification
export const verifyAdmin = async (req) => {
    try {
        const user = await verifyToken(req);
        if (user && user.role === 1) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error verifying admin:", error);
        return false;
    }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
    try {
        const isAdmin = await verifyAdmin(req);
        if (!isAdmin) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }
        next();
    } catch (error) {
        console.error("Error in admin middleware:", error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware"
        });
    }
};
