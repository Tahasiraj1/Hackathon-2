import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server";

const FASTAPI_URL = 'http://127.0.0.1:8000/chat'

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    
    const body = await request.json();

    const payload = {
        messages: body.messages,
        metadata: {
            userId: userId || null,
            timestamp: Date.now(),
        }
    }

    const response = await fetch(`${FASTAPI_URL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json({ response: data.response });
}
