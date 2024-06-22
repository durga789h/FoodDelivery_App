// api/restaurants/signup
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from 'bcryptjs';
import { restaurantSchema } from "@/app/lib/database/models/restaurants-model";
import { NextResponse } from "next/server";
import { sendEmail } from "@/app/lib/utils/sendEmail/sendEmail";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const { email, name, password, phone, address, city } = await request.json();

        // Check if the email is already in use
        const existingUser = await restaurantSchema.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate a token for email verification
        const verificationToken = jwt.sign({ email, name, hashedPassword, phone, address, city }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // Send verification email
        const verificationLink = `${process.env.BASE_URL}/restaurant/verify?token=${verificationToken}`;
        await sendEmail(email, 'Email Verification', `Click the link to verify your email: ${verificationLink}`);

        return NextResponse.json({
            message: "Signup initiated! Please verify your email.",
            success: true
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
