import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../login/route";
import { deliveryschema } from "../../../lib/database/models/deliverypartners-model";

export async function GET(request, content) {
    let city = content.params.city;
    let success = false;
    await mongoose.connect(connectionStr);
    let filter = { city: { $regex: new RegExp(city, "i") } };
    const result = await deliveryschema.find(filter);
    return NextResponse.json({ result });
}
