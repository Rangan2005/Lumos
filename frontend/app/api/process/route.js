import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function POST(request) {
  try {
    const body = await request.json();
    const { endpoint, text } = body;

    const apiUrl = `http://127.0.0.1:8000${endpoint}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}