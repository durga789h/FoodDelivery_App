import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../../restaurants/login/route";
import { restaurantSchema } from "../../../lib/database/models/restaurants-model";

export async function GET(){
    await mongoose.connect(connectionStr);
    let result=await restaurantSchema.find()
    result=result.map((item)=>item.city.charAt(0).toUpperCase()+item.city.slice(1));
    result=[...new Set(result.map((item)=>item))] //REMOVE DUPLICATE VALUE
    return NextResponse.json({success:true,result})
}