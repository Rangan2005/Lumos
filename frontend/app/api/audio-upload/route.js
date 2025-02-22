// app/api/audio-upload/route.js
import { NextResponse } from 'next/server';

// This replaces the previous config export since App Router handles body parsing differently
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // Get the raw body as ArrayBuffer
    const arrayBuffer = await request.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log("Received audio:", buffer.length, "bytes");

    // Here you would:
    // 1. Convert to MP3 (using a library like ffmpeg)
    // 2. Save the file
    // 3. Process further as needed

    return NextResponse.json(
      { 
        message: "Audio received successfully!",
        size: buffer.length 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing audio:', error);
    return NextResponse.json(
      { error: 'Error processing audio upload' },
      { status: 500 }
    );
  }
}

// Handle preflight requests if needed
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
    },
  });
}