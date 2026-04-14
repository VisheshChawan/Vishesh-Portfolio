import { put, list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// POST — upload a file (resume or avatar) to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string; // 'resume' or 'avatar'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 413 });
    }

    const prefix = `vc-${category}`;

    // Delete old file for this category
    const { blobs } = await list({ prefix });
    for (const blob of blobs) {
      await del(blob.url);
    }

    // Upload new file
    const blob = await put(`${prefix}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      success: true,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — remove a file by category
export async function DELETE(request: NextRequest) {
  try {
    const { category } = await request.json();
    const prefix = `vc-${category}`;

    const { blobs } = await list({ prefix });
    for (const blob of blobs) {
      await del(blob.url);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Delete error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
