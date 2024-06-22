// pages/api/admin/users.js
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "../../../lib/utils/auth/auth";
import { userSchema } from "../../../lib/database/models/user-model";

const connectionStr = process.env.MONGODB_URL;

export async function GET(request) {
    try {
        await mongoose.connect(connectionStr);

        // Check if the requester is an admin
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const users = await userSchema.find();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        await mongoose.connect(connectionStr);

        // Check if the requester is an admin
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const { userId } = await request.json();
        await userSchema.findByIdAndDelete(userId);
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
