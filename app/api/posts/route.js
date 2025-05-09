import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title');
    const summary = formData.get('summary');
    const content = formData.get('content');
    const source = formData.get('source');
    const sourceLink = formData.get('sourceLink');
    const status = formData.get('status');
    const image = formData.get('image');

    // Upload image to Cloudinary if present
    let imageUrl = null;
    if (image && image.size > 0) {
      try {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Convert buffer to base64
        const base64Image = buffer.toString('base64');
        const dataURI = `data:${image.type};base64,${base64Image}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'india-pakwar',
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { success: false, message: 'Error uploading image' },
          { status: 500 }
        );
      }
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Create new post
    const post = await Post.create({
      title,
      summary,
      content,
      source,
      sourceLink,
      status,
      imageUrl,
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Post created successfully',
      post 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating post' },
      { status: 500 }
    );
  }
} 