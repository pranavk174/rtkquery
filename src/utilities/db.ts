import mongoose from "mongoose";

const MONGODB_URI =
  (process.env.MONGODB_URI as string) ||
  "mongodb+srv://cpranav972:Pranav%4012@cluster0.136j88t.mongodb.net/rtkquery";

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined in env");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as any).mongoose as MongooseCache;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    //  console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  // Create connection promise if not exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    cached.promise = (async () => {
      try {
        //  console.log("🔄 Connecting to MongoDB...");
        const connection = await mongoose.connect(MONGODB_URI, opts);
        //  console.log("✅ MongoDB connected successfully");

        // Handle connection events
        connection.connection.on("error", (error) => {
          console.error("❌ MongoDB connection error:", error);
        });

        connection.connection.on("disconnected", () => {
          console.warn("⚠️ MongoDB disconnected");
          cached.conn = null;
          cached.promise = null;
        });

        return connection;
      } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        cached.promise = null;
        throw error;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
