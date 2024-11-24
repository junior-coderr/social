import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function dbConnect(): Promise<void> {
  if (isConnected) return;

  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI as string);

    isConnected = connection.readyState === 1;
    console.log("MongoDB connected");
  } catch (error: unknown) {
    console.error("MongoDB connection failed:", error);
  }
}
