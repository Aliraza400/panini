import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import UserModel, { IUser } from "@/models/user.model";

interface JwtPayload {
  id: string;
  role: string;
}

export const isAuthenticated = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authorized!",
      },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAdmin()) {
      return NextResponse.json(
        { success: false, message: "Admin access required" },
        { status: 403 }
      );
    }

    return { success: true, user };
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Invalid Token" },
      { status: 401 }
    );
  }
};

export const authorizeRoles = (user: IUser, ...roles: string[]) => {
  if (!roles.includes(user.role)) {
    return NextResponse.json(
      { success: false, message: "Not authorized" },
      { status: 403 }
    );
  }
  return NextResponse.next();
};
