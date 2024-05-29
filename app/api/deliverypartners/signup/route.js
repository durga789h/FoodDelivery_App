
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"

import { NextRequest, NextResponse } from "next/server";

import { deliveryschema } from "../../../lib/database/models/deliverypartners-model";
 const connectionStr=process.env.MONGODB_URL



export async function POST(request){
    // Defines an asynchronous POST request handler.
    try {
        await mongoose.connect(connectionStr);
        const reqBody = await request.json();
        const {  password, name, address, mobile, city } = reqBody;

    
        //Checks if a user with the provided email already exists. 
        const user = await deliveryschema.findOne({ mobile });

        //If yes, returns a 400 response.
        if (user) {
            return NextResponse.json({ error: "mobile no already exists" }, { status: 400 });
        }

        //hash password using bcryptjs.
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new deliveryschema({             
          
            name,
            city,
            address,
            mobile,
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

