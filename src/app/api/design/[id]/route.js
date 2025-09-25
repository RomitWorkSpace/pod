import connectDB from "@/lib/db";
import Design from "@/models/design";
import { NextResponse } from "next/server";


export async function GET(req, { params }){

    try{
        await connectDB();
        const { id } = await params;

        if(!id){
            return NextResponse.json({message: "Design id is not exist", status: 404});
        }

        const designs = await Design.findById(id);
        return NextResponse.json(designs);

    }catch(error){
        console.error("connection error", error);
        return NextResponse.json({message: "Design id is not exist", status: 500});
    }
}