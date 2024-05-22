import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../../restaurants/login/route";
import { restaurantSchema } from "../../../lib/database/models/restaurants-model";
import {foodschema} from "../../../lib/database/models/food-model";

export async function  GET(request,content){
   // console.log(content.params.id);
    const id=content.params.id;
    await mongoose.connect(connectionStr)
    const details=await restaurantSchema.findOne({_id:id})
    const foodItems=await foodschema.find({resto_id:id})
    return NextResponse.json({success:true,details,foodItems})
}