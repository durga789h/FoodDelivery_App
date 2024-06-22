// pages/api/Admin/restaurant/route.js
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { restaurantSchema } from "@/app/lib/database/models/restaurants-model";
import { verifyAdmin } from "@/app/lib/utils/auth/auth"; // Ensure this path is correct based on your project structure

const connectionStr = process.env.MONGODB_URL;

export async function GET(request) {
    try {
        await mongoose.connect(connectionStr);

        // Check if the requester is an admin
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const restaurants = await restaurantSchema.find();
        return NextResponse.json({ result: restaurants });
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

        const { restaurantId } = await request.json();
        await restaurantSchema.findByIdAndDelete(restaurantId);
        return NextResponse.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
