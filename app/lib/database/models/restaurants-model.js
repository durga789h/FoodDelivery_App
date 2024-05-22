import mongoose from "mongoose";

const restaurantsModel = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    city:String,
    address:String,
    phone:String
});

export const restaurantSchema = mongoose.models.restaurants || mongoose.model("restaurants", restaurantsModel);

