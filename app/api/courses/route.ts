import connectDB from "@/lib/db";
import CourseModel from "@/models/course.model";
import TopicModel from "@/models/topic.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { name, topics } = await req.json();

    // Ensure topicId is an array (can also validate topics exist if needed)
    const topicIds = Array.isArray(topics) ? topics : [topics];

    // Create the course with referenced topic IDs
    const existingCourse = await CourseModel.findOne({ name });
    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: `Course with the name ${name} already exists!`,
        },
        { status: 400 }
      );
    }
    const course = new CourseModel({ name, topics: topicIds });
    await course.save();

    const populatedCourse = await CourseModel.findById(course._id);

    return NextResponse.json({
      success: true,
      message: "Course Created!",
      course: populatedCourse,
    });
  } catch (err) {
    console.error("Error creating course:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Create Course!",
      },
      { status: 500 }
    );
  }
}



export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const courses = await CourseModel.find();
    /* const topicIds = courses.map((course) => course.topics).flat();
    const topics = await TopicModel.find({ _id: { $in: topicIds } });

    const populatedCourses = courses.map((course) => {
      const courseTopics = topics.filter((topic) =>
        course.topics.includes(topic._id.toString())
      );
      return { ...course.toObject(), topics: courseTopics };
    }); */

    return NextResponse.json({
      success: true,
      message: "Courses Fetched Successfully!",
      courses: courses,
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Fetch Course!",
      },
      { status: 500 }
    );
  }
}
