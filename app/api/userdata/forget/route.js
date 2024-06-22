// api/userdata/forget/route.js
import mongoose from "mongoose";
import { userSchema } from "../../../lib/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const { email } = await request.json();

        const user = await userSchema.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User with this email does not exist" }, { status: 400 });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpire = Date.now() + 3600000; // Token expires in 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;

        await user.save();

        // Send email with the reset token
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.GMAIL_USER,
            subject: "Password Reset",
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
            http://localhost:3000/reset-password?token=${resetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Reset link sent to email" });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
