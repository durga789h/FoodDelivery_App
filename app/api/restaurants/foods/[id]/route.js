import { foodschema } from "../../../../lib/database/models/food-model";
import { NextResponse } from "next/server";
import { connectionStr } from "../../login/route";
import mongoose from "mongoose";


export async function GET(request,content){

    try {
        const id=content.params.id
    //console.log(id);
    let success=false
    await mongoose.connect(connectionStr);
    const result=await foodschema.find({resto_id:id})
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

export async function DELETE(request,content){
    try {
        const id=content.params.id;
        let success=false
        await mongoose.connect(connectionStr);
        const result=await foodschema.deleteOne({_id:id})
        if(result.deletedCount>0){
            success=true
        }
        return NextResponse.json({result,success});
            
        
    } catch (error) {
        console.error("Error adding food:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

