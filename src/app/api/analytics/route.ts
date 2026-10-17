import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const analytics = db.getAnalytics();
    return NextResponse.json({ success: true, data: analytics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
