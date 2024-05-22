import { foodschema } from "../../../../../lib/database/models/food-model";
import { connectionStr } from "../../../login/route";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function GET(request,content){

    try {
        const id=content.params.id
    //console.log(id);
    let success=false
    await mongoose.connect(connectionStr);
    const result=await foodschema.findOne({_id:id})
     // console.log(result)
    if(result){
        success=true
    }
    return NextResponse.json({result,success});
        
    } catch (error) {
        console.error("Error adding food:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
}

export async function PUT(request, { params }) {
    try {
        const id = params.id;
        const updateUserData = await request.json();
        let success = false;
        await mongoose.connect(connectionStr);
        const result = await foodschema.updateOne(
            { _id: id },
            { $set: updateUserData }
        );
        if (result.nModified > 0) {
            success = true;
        }
        return NextResponse.json({ result, success });
    } catch (error) {
        console.error("Error updating food:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}