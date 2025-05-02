import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import UserModel from '@/models/user.model';

connectDB();

export async function POST(req: Request) {
  try {
    const { fullname, email, password, role } = await req.json();

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new UserModel({
      fullname,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    if(user.email === "admin@panini8.com") {
        user.role = "admin"
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
