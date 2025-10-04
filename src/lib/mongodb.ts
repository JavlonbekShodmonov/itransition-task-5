import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI missing in environment variables");
}

// nota bene: prevent multiple connections in dev hot-reload
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
