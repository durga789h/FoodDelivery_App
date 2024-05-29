
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"

import { NextRequest, NextResponse } from "next/server";
import { deliveryschema } from "../../../lib/database/models/deliverypartners-model";
 export const connectionStr=process.env.MONGODB_URL

 export async function POST(request){
    try {
        await mongoose.connect(connectionStr);
        const reqbody = await request.json()
        const {mobile, password} = reqbody

        //check if user exists
        const user = await deliveryschema.findOne({mobile})

        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        //check if password is correct
        const validPassword = await bcryptjs.compare
        (password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

//create token data
// A JavaScript object (tokenData) is created to store essential user 
// information. In this case, it includes the user's unique identifier (id), 
// username, and email.

        const tokenData = {
            id: user._id,
            username: user.name,
            mobile: user.mobile
        }

        // Create a token with expiration of 1 day
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        // Create a JSON response indicating successful login
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            data:tokenData,
            token
        })

        // Set the token as an HTTP-only cookie
        response.cookies.set("token", token, user, {
            httpOnly: true,
        })

        return response;

    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})

    }
}
