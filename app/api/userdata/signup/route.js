// pages/api/userdata/signup.js
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";
import { userSchema } from "../../../lib/database/models/user-model";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const reqBody = await request.json();
        const { email, password, name, address, mobile, city } = reqBody;

        // Checks if a user with the provided email already exists.
        const user = await userSchema.findOne({ email });

        // If yes, returns a 400 response.
        if (user) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        // Hash password using bcryptjs.
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new userSchema({
            email,
            name,
            city,
            address,
            mobile,
            password: hashedPassword,
            role: 0, // Default role is set to 0, this can be changed based on your requirements
           
        });
console.log(newUser)
        // Saves the new user to the database.
        const savedUser = await newUser.save();
        console.log(savedUser);
        // Convert savedUser to a plain object to include all fields in the response.
        const userResponse = savedUser.toObject();
        console.log(userResponse);

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser: userResponse
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
