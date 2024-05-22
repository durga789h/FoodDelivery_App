import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../restaurants/login/route";
import { restaurantSchema } from "../../lib/database/models/restaurants-model";

export async function GET(request){
    let queryParams=request.nextUrl.searchParams
    //http://localhost:3000/api/customer?location=bhopal  check it on postman or browser
    console.log(queryParams.get("restaurant"))
    let filter={}
    //if(queryParams.get("location")){
      //  filter.city=queryParams.get("location")
  //  }
 if(queryParams.get("location")){
    let city=queryParams.get("location")
      filter={city:{$regex:new RegExp(city,"i")}}
   }
   else 
    if(queryParams.get("restaurant")){
        let name=queryParams.get("restaurant")
        filter={name:{$regex:new RegExp(name,"i")}}
   }

    await mongoose.connect(connectionStr)
    let result= await restaurantSchema.find(filter)
    return NextResponse.json({success:true,result})
}