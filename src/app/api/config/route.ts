import { put, list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

const CONFIG_FILENAME = 'vc-portfolio-config.json';

// GET — fetch the latest saved config for all visitors
export async function GET() {
  try {
    const { blobs } = await list({ prefix: CONFIG_FILENAME });

    if (blobs.length === 0) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    // Fetch the actual JSON content from the blob URL
    const latestBlob = blobs[blobs.length - 1];
    const response = await fetch(latestBlob.url);
    const data = await response.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error('Config GET error:', error.message);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

// POST — admin saves the full config to Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Delete old config blobs first
    const { blobs } = await list({ prefix: CONFIG_FILENAME });
    for (const blob of blobs) {
      await del(blob.url);
    }

    // Upload new config
    const blob = await put(CONFIG_FILENAME, JSON.stringify(body), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Config POST error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
