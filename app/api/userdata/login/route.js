//api/userdata/login/route.js
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken"
import { userSchema } from "../../../lib/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
//import { restaurantSchema } from "../../../lib/database/models/restaurants-model";
 export const connectionStr=process.env.MONGODB_URL

 export async function POST(request){
    try {
        await mongoose.connect(connectionStr);
        const reqbody = await request.json()
        const {email, password} = reqbody

        //check if user exists
        const user = await userSchema.findOne({email})

        //const user2=await userSchema.findOne({address})

        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        
        //check if password is correct
        const validPassword = await bcryptjs.compare
        (password, user.password)
        console.log(validPassword)
        console.log(password);
        console.log(user.password);
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

//create token data
// A JavaScript object (tokenData) is created to store essential user 
// information. In this case, it includes the user's unique identifier (id), 
// username, and email.

        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
            address:user.address,
            mobile:user.mobile,
            city:user.city,
            role:user.role
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
