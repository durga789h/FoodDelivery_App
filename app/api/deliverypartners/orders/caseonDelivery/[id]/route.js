
import mongoose from "mongoose";

import { Orderschema } from "../../../../../lib/database/models/ordercaseonDelivery";
import { NextResponse } from "next/server";
import { connectionStr } from "../../../../userdata/login/route";
import { restaurantSchema } from "../../../../../lib/database/models/restaurants-model";



//this is my case on delivery-items
export async function GET(request,content) {
    try {
        const id = content.params.id
        let success=false
        await mongoose.connect(connectionStr);
        let result = await Orderschema.find({ deliveryBoy_id: id });
        console.log(result)
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

