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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectToDatabase();
    await Post.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting post' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    // Get all form fields
    const updates = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      content: formData.get('content'),
      source: formData.get('source'),
      sourceLink: formData.get('sourceLink'),
      status: formData.get('status'),
    };

    // Handle image upload if present
    const image = formData.get('image');
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
        updates.imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json(
          { success: false, message: 'Error uploading image' },
          { status: 500 }
        );
      }
    }

    await connectToDatabase();
    const post = await Post.findByIdAndUpdate(id, updates, { new: true });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating post' },
      { status: 500 }
    );
  }
} 