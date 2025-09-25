import connectDB from "@/lib/db";
import Design from "@/models/design";
import { NextResponse } from "next/server";



// ---- to get all design --------
export async function GET(){

    try {
        await connectDB();
        const designs = await Design.find().sort({ createdAt: -1 });
        return NextResponse.json({ designs });
    } catch (error) {
        return NextResponse.json(
        { error: 'Failed to fetch designs', status: 500 }
        );
    }
}

