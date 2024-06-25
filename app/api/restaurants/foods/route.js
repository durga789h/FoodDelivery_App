// /app/api/restaurants/foods/route.js
import { foodschema } from "../../../lib/database/models/food-model";
import { connectionStr } from "../login/route";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import cloudinary from '../../../cloudinary';

// For handling POST Requests
export const POST = async (request) => {
  await mongoose.connect(connectionStr);

  try {
    const data = await request.formData();
    const file = data.get('path');
    const name = data.get('name');
    const price = data.get('price');
    const description = data.get('description');
    const resto_id = data.get('resto_id');

    if (!file || !file.name) {
      throw new Error('File not provided or invalid');
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, {
      folder: 'food_items'
    });

    const food = new foodschema({
      name,
      price,
      description,
      path: uploadResult.secure_url,
      resto_id,
    });

    const savedFood = await food.save();

    return NextResponse.json({ result: savedFood, success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving food item:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
