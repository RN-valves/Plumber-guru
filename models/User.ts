import mongoose, { Schema, type Model } from "mongoose";

export type UserRole = "plumber" | "customer" | "admin";

export interface IUser {
  phone: string;
  name?: string;
  email?: string;
  role: UserRole;
  city?: string;
  skills?: string[];
  language?: string;
  isProfileComplete: boolean;
  profileComplete?: number;
  lastLogin?: Date;
  createdAt: Date;
  isActive: boolean;
  verified?: boolean;
  image?: string | null;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    role: {
      type: String,
      enum: ["plumber", "customer", "admin"],
      default: "plumber",
    },
    city: { type: String, default: "" },
    skills: { type: [String], default: [] },
    language: { type: String, default: "hi" },
    isProfileComplete: { type: Boolean, default: false },
    profileComplete: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    image: { type: String, default: null },
  },
  { collection: "users" }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
