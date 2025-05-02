import mongoose, { Document, model, models, Schema } from "mongoose";

export interface IGoal extends Document {
  name: string;
  courses: mongoose.Types.ObjectId[];
}

const goalSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", 
      }
    ]
  },
  {
    timestamps: true,
  }
);

const GoalModel = models.Goal || model("Goal", goalSchema);
export default GoalModel;
