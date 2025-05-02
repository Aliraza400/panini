import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AssignmentModel from "@/models/assignment.model";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import GoalModel from "@/models/goal.model";
import CourseModel from "@/models/course.model";
import TopicModel from "@/models/topic.model";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, goalId, courseId, topics } = body;

    if (!userId || !goalId || !courseId || !topics) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const newAssignment = await AssignmentModel.create({
      userId: mongoose.Types.ObjectId.createFromHexString(userId),
      goalId: mongoose.Types.ObjectId.createFromHexString(goalId),
      courseId: mongoose.Types.ObjectId.createFromHexString(courseId),
      topics: mongoose.Types.ObjectId.createFromHexString(topics),
    });

    return NextResponse.json({ success: true, assignment: newAssignment });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message, error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const assignments = await AssignmentModel.find();

    const populatedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const goal = await GoalModel.findById(assignment.goalId).lean();
        const course = await CourseModel.findById(assignment.courseId).lean();
        const topic = await TopicModel.findById(assignment.topicId).lean();

        return {
          ...assignment.toObject(),
          goal,
          course,
          topic,
        };
      })
    );

    return NextResponse.json({
      success: true,
      assignments: populatedAssignments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch assignments" },
      { status: 500 }
    );
  }
}
