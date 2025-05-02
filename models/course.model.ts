import mongoose, { Schema, model, models } from "mongoose";

const courseSchema = new Schema(
  {
    name: { type: String, required: true },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true }],
  },
  {
    timestamps: true,
  }
);

const CourseModel = models.Course || model("Course", courseSchema);
export default CourseModel;

