import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Post from '@/models/Post';

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
    const updates = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      content: formData.get('content'),
      source: formData.get('source'),
      status: formData.get('status'),
    };

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