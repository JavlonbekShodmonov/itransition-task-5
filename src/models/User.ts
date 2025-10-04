import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  status: "unverified" | "active" | "blocked";
  lastLogin?: Date;
  confirmationToken?: string;
  isAdmin?: boolean;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ["unverified", "active", "blocked"], default: "unverified" },
  lastLogin: { type: Date },
  confirmationToken: { type: String },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

// important: enforce unique email
UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
