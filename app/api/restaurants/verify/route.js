// api/restaurants/verify
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { restaurantSchema } from "@/app/lib/database/models/restaurants-model";
import { NextResponse } from "next/server";
import { parse } from "url";

const connectionStr = process.env.MONGODB_URL;

export async function GET(request) {
    try {
        await mongoose.connect(connectionStr);
        const { query } = parse(request.url, true); // Parse the query parameters
        const { token } = query; // Destructure the token from the query object

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        const { email, name, hashedPassword, phone, address, city } = decoded;

        // Check if the user is already verified and stored
        const existingUser = await restaurantSchema.findOne({ email });
        if (existingUser && existingUser.isVerified) {
            return NextResponse.json({ message: "Email is already verified" }, { status: 200 });
        }

        // Create and save the user
        const user = new restaurantSchema({
            email,
            name,
            password: hashedPassword, // Use the hashed password
            phone,
            address,
            city,
            isVerified: true
        });

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully!",
            success: true
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
