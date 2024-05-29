import mongoose from "mongoose";
import { connectionStr } from "../userdata/login/route";
import { Orderschema } from "../../lib/database/models/ordercaseonDelivery";
import { NextResponse } from "next/server";
import { restaurantSchema } from "../../lib/database/models/restaurants-model";
import { foodschema } from "../../lib/database/models/food-model";

export async function POST(request) {
    try {
        const payload = await request.json();
        await mongoose.connect(connectionStr);
        let success = false;
        const orderObj = new Orderschema(payload);
        const result = await orderObj.save();
        if (result) {
            success = true;
        }
        return NextResponse.json({ result,success })
       
    }
    catch(error){
        console.log(error)
    }
}

export async function GET(request) {
    try {
        const userId = request.nextUrl.searchParams.get("id");
        let success=false
        await mongoose.connect(connectionStr);
        let result = await Orderschema.find({ user_id: userId });
        if(result){
         let restoData=await Promise.all(
            result.map(async(item)=>{
                let restoInfo={};
                restoInfo.data=await restaurantSchema.findOne({_id:item.resto_id})
                restoInfo.amount=item.amount;
                restoInfo.status=item.status
                return restoInfo;
             })
         )
         result=restoData;
         success=true
        }
      
        return NextResponse.json({ result, success });
    } catch (error) {
        console.error("Error in GET /api/ordercase:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}
