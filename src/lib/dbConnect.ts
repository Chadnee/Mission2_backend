import mongoose from 'mongoose';
import config from '../app/config';

const MONGODB_URI = config.database_url as string;

if (!MONGODB_URI) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

// Cache the connection across hot reloads in development
let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      bufferCommands: false, // <-- disables buffering, so you get fast errors
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;