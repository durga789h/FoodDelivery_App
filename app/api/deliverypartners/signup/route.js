// api/deliverypartners/signup
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from "next/server";
import { deliveryschema } from "../../../lib/database/models/deliverypartners-model";

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
  // Defines an asynchronous POST request handler.
  try {
    await mongoose.connect(connectionStr);
    const reqBody = await request.json();
    const { password, name, address, mobile, city } = reqBody;

    // Checks if a user with the provided mobile number already exists.
    const user = await deliveryschema.findOne({ mobile });

    // If yes, returns a 400 response.
    if (user) {
      return NextResponse.json({ error: "Mobile number already exists" }, { status: 400 });
    }

    // Hash password using bcryptjs.
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
  } finally {
    // Ensure the connection is closed when the function finishes
    mongoose.connection.close();
  }
}

export async function GET(request) {
  // Defines an asynchronous GET request handler.
  try {
    await mongoose.connect(connectionStr);
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');

    if (!mobile) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
    }

    // Checks if a user with the provided mobile number already exists.
    const user = await deliveryschema.findOne({ mobile });

    // Returns response based on whether the user exists.
    if (user) {
      return NextResponse.json({ message: "Mobile number is registered", registered: true }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Mobile number is not registered", registered: false }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Ensure the connection is closed when the function finishes
    mongoose.connection.close();
  }
}
