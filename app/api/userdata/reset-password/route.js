import mongoose from "mongoose";
import { userSchema } from "../../../lib/database/models/user-model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs'; // Import bcryptjs for hashing

const connectionStr = process.env.MONGODB_URL;

export async function POST(request) {
  try {
    await mongoose.connect(connectionStr);
    const { token, email, newPassword } = await request.json();
    console.log(`Received token: ${token}, newPassword: ${newPassword}`);

    if (!token || !email || !newPassword) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const user = await userSchema.findOne({ email, resetPasswordToken: token });
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(`User found: ${user.email}`);
    console.log(`Stored resetToken: ${user.resetPasswordToken}, token expiry: ${user.resetPasswordExpire}`);

    if (user.resetPasswordToken !== token || user.resetPasswordExpire < Date.now()) {
      console.log('Invalid or expired token');
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 });
  } catch (error) {
    console.error('Error in reset-password validation', error);
    return NextResponse.json({
      success: false,
      message: "Error in reset-password validation",
      error: error.message
    });
  }
}
