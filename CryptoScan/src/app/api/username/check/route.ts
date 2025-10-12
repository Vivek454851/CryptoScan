// src/app/api/username/check/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raw = (body?.username ?? '').toString().trim();

    if (!raw) {
      return NextResponse.json({ available: false, message: 'Username required' }, { status: 400 });
    }

    // basic validation: letters, numbers, underscore, 3-20 chars
    const match = /^[a-zA-Z0-9_]{3,20}$/.test(raw);
    if (!match) {
      return NextResponse.json({
        available: false,
        message: 'Use 3–20 letters, numbers, or underscore only',
      }, { status: 400 });
    }

    const username = raw.toLowerCase();

    await connectDB();
    const existing = await User.findOne({ username });

    if (existing) {
      return NextResponse.json({ available: false, message: 'Username taken' });
    }
    return NextResponse.json({ available: true, message: 'Username available' });
  } catch (e) {
    console.error('username check error', e);
    return NextResponse.json({ available: false, message: 'Server error' }, { status: 500 });
  }
}
