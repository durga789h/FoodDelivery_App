import mongoose from "mongoose";

const foodModel= new mongoose.Schema(
    {
name:String,
price:Number,
path:String,
description:String,
resto_id:mongoose.Schema.Types.ObjectId
    }
)

export const foodschema=mongoose.models.foods || mongoose.model("foods",foodModel);