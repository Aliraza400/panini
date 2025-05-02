import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IAssignment extends Document {
    userId: string,
    goalId: mongoose.Types.ObjectId,
    courseId: mongoose.Types.ObjectId,
    topicId: mongoose.Types.ObjectId
}

const assignmentSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  topics: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
}, {
    timestamps: true
});

const AssignmentModel = models.Assignment || model<IAssignment>('Assignment', assignmentSchema)
export default AssignmentModel