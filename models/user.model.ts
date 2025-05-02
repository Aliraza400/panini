// import mongoose, { Document, model, Schema } from 'mongoose'

// export interface IUser extends Document {
//     fullname: string,
//     email: string,
//     password: string,
//     role: 'user' | 'admin'
// }

// const userSchema: Schema = new Schema({
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     role: {
//         type: String,
//         enum: ['user', 'admin'],
//         default: 'user'
//     }

// }, {
//     timestamps: true
// })

// const UserModel = mongoose.models.User | model<IUser>('User', userSchema)
// export default UserModel

import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isAdmin: () => boolean
}

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isAdmin = function() {
    return this.role === 'admin' || this.email === 'admin@panini8.com'
}

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
