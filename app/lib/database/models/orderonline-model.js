import mongoose from "mongoose";

const orderModel= new mongoose.Schema(
    {
user_id:mongoose.Schema.Types.ObjectId,
foodItemIds:String,
resto_id:mongoose.Schema.Types.ObjectId,
deliveryBoy_id:mongoose.Schema.Types.ObjectId,
status:String,
amount:String,

    }
)

export const orderSchema=mongoose.models.orderOnline || mongoose.model("orderOnline",orderModel);