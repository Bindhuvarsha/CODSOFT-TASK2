import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const tables = db.getTables();
    return NextResponse.json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.tableId || !body.status) {
      return NextResponse.json(
        { success: false, error: 'tableId and status are required' },
        { status: 400 }
      );
    }

    const updated = db.updateTableStatus(body.tableId, body.status, body.guestName);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Table not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update table' },
      { status: 500 }
    );
  }
}
