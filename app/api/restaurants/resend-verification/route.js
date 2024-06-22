// api/restaurants/resend-verification
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/app/lib/utils/sendEmail/sendEmail";
import { restaurantSchema } from "@/app/lib/database/models/restaurants-model";
import { NextResponse } from "next/server";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const { email } = await request.json();

        const user = await restaurantSchema.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Email not found" }, { status: 400 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: "Email is already verified" }, { status: 200 });
        }

        const verificationToken = jwt.sign({ email: user.email }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        user.verificationToken = verificationToken;
        await user.save();

        const verificationLink = `http://localhost:3000/restaurant/verify?token=${verificationToken}`;
        await sendEmail(email, 'Email Verification', `Click the link to verify your email: ${verificationLink}`);

        return NextResponse.json({
            message: "Verification email resent successfully!",
            success: true
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
