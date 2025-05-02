import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import UserModel from "@/models/user.model";

export async function POST(req: Request) {
    try {
      await connectDB();
      const { email, password } = await req.json();
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        );
      }
  
      // Check admin status
      const isAdmin = user.role === 'admin' || user.email === 'admin@panini8.com';


      if (!isAdmin) {
        return NextResponse.json(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        );
      }
  
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );
  
      const response = NextResponse.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          isAdmin // Add this property
        }
      });
  
      response.cookies.set('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60
      });
  
      return response;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Server error' },
        { status: 500 }
      );
    }
  }