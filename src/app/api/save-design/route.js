import connectDB from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Design from '@/models/design';
import { NextResponse } from 'next/server';


const writeFileAsync = promisify(fs.writeFile);

export async function POST(request){
  
  try{

    await connectDB();
    const body = await request.json();

    const { designData, designName, designInfo } = body;

    const base64Data = designData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create directory if it doesn't exist
    const dir = path.join(process.cwd(), 'public', 'designs');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

        // Generate filename
    const filename = `${designName || 'design'}-${Date.now()}.png`;
    const filePath = path.join(dir, filename);
    
    // Save file
    await writeFileAsync(filePath, buffer);

    const design = new Design({
        userId: "107088752687634666146",
        name: designName || "Untitled Design",
        width: 220,
        height: 250,
        canvasData: designInfo,
        userDesign: `/designs/${filename}`,
        category: "Polo",
    });

    await design.save();

    return NextResponse.json({
      success: true,
      data: design.userDesign,
    });

  }
  catch(error){
    NextResponse.json(
      { message: 'Error saving design', status: 500 }
    );
  }
}


// export async function POST(request) {

// console.log(request.body);
//     try {
//     // 1. Connect to MongoDB
//     await connectDB();


//     const { designData, designName, designInfo } = request.body;
//     // const designCanvas = designInfo.toJSON(["id", "filters"]);

//     const canvasData = JSON.stringify(designInfo);
//     // const designData = {
//     //   canvasData: JSON.stringify(canvasData),
//     //   width: canvas.width,
//     //   height: canvas.height,
//     // };
//       console.log(canvasData);
    
//       // 2. Convert base64 to buffer and save to file system
//     const base64Data = designData.replace(/^data:image\/png;base64,/, '');
//     const buffer = Buffer.from(base64Data, 'base64');
    
//     // Create directory if it doesn't exist
//     const dir = path.join(process.cwd(), 'public', 'designs');
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
    
//     // Generate filename
//     const filename = `${designName || 'design'}-${Date.now()}.png`;
//     const filePath = path.join(dir, filename);
    
//     // Save file
//     await writeFileAsync(filePath, buffer);

//     // 3. Save metadata to MongoDB

//      const design = new Design({
//         userId: "107088752687634666146",
//         name: designName || "Untitled Design",
//         width: "220px",
//         height: "250px",
//         canvasData,
//         userDesign: `/designs/${filename}`,
//         category: "Polo",
//     });

//     await design.save();

    

//     return NextResponse.json({
//       success: true,

//     });
//   }
//   catch (error) {
//     console.error('Error saving design:', error);
//     NextResponse.json({ message: 'Error saving design', status: 500 });
//   }
// }