import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    // Parse the request body
    const body = await request.json();
    const { name, email, age } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      age: age || null
    });

    // Save to database
    const savedUser = await newUser.save();

    // Return success response
    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: savedUser 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating user:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Also add a GET method to fetch users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}