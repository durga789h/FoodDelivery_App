// pages/api/Admin/restaurant/route.js
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/app/lib/utils/auth/auth"; // Ensure this path is correct based on your project structure
import { deliveryschema } from "@/app/lib/database/models/deliverypartners-model";

const connectionStr = process.env.MONGODB_URL;

export async function GET(request) {
    try {
        await mongoose.connect(connectionStr);

        // Check if the requester is an admin
        const isAdmin = await verifyAdmin(request);
        if (!isAdmin) {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const deliveryboydata = await deliveryschema.find();
        return NextResponse.json({ result: deliveryboydata });
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

        const { deliveryId } = await request.json();
        await deliveryschema.findByIdAndDelete(deliveryId);
        return NextResponse.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
