// pages/api/admin/login.js
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { userSchema } from "../../../lib/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const { email, password } = await request.json();

        const user = await userSchema.findOne({ email });

        if (!user || user.role !== 1) {  // Check if the user is an admin by role
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role  // Include role in token data
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "2hr" });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            data: tokenData,
            token,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
