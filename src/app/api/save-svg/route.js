import { NextResponse } from "next/server"
import { promisify } from 'util';
import fs from "fs";
import path from "path";
import connectDB from "@/lib/db";
import Design from '@/models/design';


export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { designData ,designName, designInfo } = body;


        // Ensure uploads folder exists
        const saveDir = path.join(process.cwd(), "public", "designs")
        if (!fs.existsSync(saveDir)) {
          fs.mkdirSync(saveDir, { recursive: true })
        }
    
        // Create unique file name
        const fileName = `design-${Date.now()}.svg`
        const filePath = path.join(saveDir, fileName)
    
        // Save SVG file
        await writeFileAsync(filePath, designData, "utf-8")
    

    const design = new Design({
            userId: "107088752687634666146",
            name: designName || "Untitled Design",
            width: 220,
            height: 250,
            canvasData: designInfo,
            userDesign: `/designs/${fileName}`,
            category: "Polo",
        });

    await design.save();

    return NextResponse.json({
      success: true,
      data: design.userDesign,
    })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
