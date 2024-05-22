import { foodschema } from "../../../lib/database/models/food-model";
import { connectionStr } from "../login/route";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await mongoose.connect(connectionStr);
        const payload = await request.json();
        let success=false;
        const food = new foodschema(payload);
        const result = await food.save();
        if(result){
            success=true
        }
        return NextResponse.json({ result, success }, { status: 200 });
    } catch (error) {
        console.error("Error adding food:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
