import mongoose from "mongoose";

const deliveryModel= new mongoose.Schema(
    {
        name: String,
        password:String,
        city:String,
        address:String,
        mobile:String
    }
)

export const deliveryschema=mongoose.models.deliverypartners || mongoose.model("deliverypartners",deliveryModel);