
import { restaurantSchema } from "@/app/lib/database/models/restaurants-model";
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"

import { NextRequest, NextResponse } from "next/server";
 const connectionStr=process.env.MONGODB_URL

export async function GET(){
    try {
        await mongoose.connect(connectionStr);
        const data = await restaurantSchema.find();
        console.log(data);
        return NextResponse.json({ result: data });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function POST(request){
    // Defines an asynchronous POST request handler.
    try {
        await mongoose.connect(connectionStr);
        const reqBody = await request.json();
        const { email, password, name, address, phone, city } = reqBody;

    
        //Checks if a user with the provided email already exists. 
        const user = await restaurantSchema.findOne({ email });

        //If yes, returns a 400 response.
        if (user) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        //hash password using bcryptjs.
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new restaurantSchema({             
            email,
            name,
            city,
            address,
            phone,
            password: hashedPassword
        });

        // Saves the new user to the database.
        const savedUser = await newUser.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

