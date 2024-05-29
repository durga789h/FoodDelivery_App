import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectionStr } from "../../../../userdata/login/route";
import { orderSchema } from "../../../../../lib/database/models/orderonline-model";
import { restaurantSchema } from "../../../../../lib/database/models/restaurants-model";

export async function GET(request, { params }) {
    const { id } = params;
    let success = false;

    try {
        await mongoose.connect(connectionStr);
        console.log(`Fetching orders for deliveryBoy_id: ${id}`);
        let result = await orderSchema.find({ deliveryBoy_id: id });

        if ( result.length > 0) {
            console.log(`Found ${result.length} orders for deliveryBoy_id: ${id}`);
            let restoData = await Promise.all(
                result.map(async (item) => {
                    let restoInfo = {};
                    restoInfo.data = await restaurantSchema.findOne({ _id: item.resto_id });
                    restoInfo.amount = item.amount;
                    restoInfo.status = item.status;
                    return restoInfo;
                })
            );
            result = restoData;
            success = true;
        } else {
            console.log(`No orders found for deliveryBoy_id: ${id}`);
        }

        return NextResponse.json({ result, success });
    } catch (error) {
        console.error("Error in GET /api/deliverypartners/orders/onlinepayment:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}
