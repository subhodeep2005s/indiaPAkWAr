import { NextResponse } from 'next/server';
import { connectToDatabase, createAdminUser } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Create admin user if it doesn't exist
    await createAdminUser();
    
    // Find user
    const user = await User.findOne({ username });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Compare password
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Create response
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Login successful',
        user: {
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    );

    // Set cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 1 day
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 