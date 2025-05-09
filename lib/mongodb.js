import mongoose from 'mongoose';
import User from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Create initial admin user if it doesn't exist
export async function createAdminUser() {
  try {
    await connectToDatabase();
    
    // Check if admin exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      // Create new admin user
      const adminUser = new User({
        username: 'admin',
        password: 'bahenkilenebale',
        role: 'admin'
      });

      // Save the user (password will be hashed by the pre-save hook)
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}
