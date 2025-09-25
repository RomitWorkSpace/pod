import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';
import Media from '@/models/media';
import connectDB from '@/lib/db';

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file');
    const alt = formData.get('alt') || '';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const publicId = `nextjs-uploads/${originalName}_${timestamp}`;

    // Upload to Cloudinary with explicit signature parameters
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'nextjs-uploads',
          public_id: publicId,
          timestamp: timestamp,
          // Optional: Add transformation parameters
          transformation: [
            { width: 1000, height: 1000, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(buffer);
    });

    // Save to MongoDB
    const image = new Media({
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      alt: alt,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
    });

    await image.save();

    return NextResponse.json({
      success: true,
      image: {
        id: image._id,
        url: image.url,
        public_id: image.public_id,
        alt: image.alt,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // More specific error messages
    if (error.http_code === 401) {
      return NextResponse.json(
        { error: 'Cloudinary authentication failed. Check your API credentials.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// GET method remains the same
export async function GET() {
  try {
    await connectDB();
    const images = await Media.find().sort({ createdAt: -1 });
    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}