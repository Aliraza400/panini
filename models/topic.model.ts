import { models } from "mongoose";
import { Document, model, Schema } from "mongoose";

export interface ITopic extends Document {
    name: string
}

const topicSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const TopicModel = models.Topic || model<ITopic>('Topic', topicSchema)
export default TopicModel