import mongoose from "mongoose";

const restaurantsModel = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    city: String,
    address: String,
    phone: String,
    isVerified: { type: Boolean, default: false }, // Add verification status
    verificationToken: String // Add verification token
});

export const restaurantSchema = mongoose.models.restaurants || mongoose.model("restaurants", restaurantsModel);
