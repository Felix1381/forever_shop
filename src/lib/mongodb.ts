import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Ensure database name is included (same logic as createAdmin script)
    const dbUri = MONGODB_URI.includes('mongodb+srv') 
      ? `${MONGODB_URI}${MONGODB_URI.endsWith('/') ? '' : '/'}forever_shop`
      : MONGODB_URI;
    
    console.log('🔌 Connecting to MongoDB with URI:', dbUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    cached.promise = mongoose.connect(dbUri, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
