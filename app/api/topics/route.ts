import connectDB from "@/lib/db";
import { isAuthenticated } from "@/middlewares/auth.middleware";
import TopicModel from "@/models/topic.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Check authentication
    /* const authResponse = await isAuthenticated(req);
    if (authResponse) {
      // If middleware returns a response (unauthorized), return it
      return authResponse;
    }
 */
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, message: "Topic name is required and must be a string" },
        { status: 400 }
      );
    }

    const topic = new TopicModel({ name });
    await topic.save();

    return NextResponse.json({ success: true, topic }, { status: 201 });
  } catch (error) {
    console.error("POST /api/topics error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create topic" },
      { status: 500 }
    );
  }
}

export async function GET(res: NextResponse) {
  try {
    const topics = await TopicModel.find();

    return NextResponse.json({
      success: true,
      numberOfTopics: topics.length,
      topics,
    });
  } catch (err) {
    console.error("GET /api/topics error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch topics!",
      },
      { status: 500 }
    );
  }
}
