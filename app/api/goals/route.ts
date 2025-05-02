import connectDB from "@/lib/db";
import CourseModel from "@/models/course.model";
import GoalModel from "@/models/goal.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { name, courses } = await req.json();

    const courseIds = Array.isArray(courses) ? courses : [courses];

    const goal = new GoalModel({ name, courses: courseIds });
    await goal.save();

    return NextResponse.json({
      success: true,
      message: "Goal Created!",
      goal,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error creating goal",
      error: error.message,
    });
  }
}

export async function GET(res: NextResponse) {
  try {
    const goals = await GoalModel.find();

    // Fetch courseIds from all goals
    const courseIds = goals.map((goal) => goal.courses).flat();

    // Fetch courses from the database
    const courses = await CourseModel.find({ _id: { $in: courseIds } });

    // Remove topicId from courses after fetching
    const cleanedCourses = courses.map((course) => {
      const { topicId, ...courseWithoutTopicId } = course.toObject();
      return courseWithoutTopicId;
    });

    // Map the goals with the populated courses
    const populatedGoals = goals.map((goal) => {
      const goalCourses = cleanedCourses.filter((course) =>
        goal.courses.includes(course._id.toString())
      );

      return { ...goal.toObject(), courses: goalCourses };
    });

    return NextResponse.json({ success: true, goals: populatedGoals });
  } catch (error) {
    console.error("Error fetching goals with manual population:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}



