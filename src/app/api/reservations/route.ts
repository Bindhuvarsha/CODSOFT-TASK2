import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    let reservations = db.getReservations();
    if (date) {
      reservations = reservations.filter((r) => r.date === date);
    }

    return NextResponse.json({ success: true, count: reservations.length, data: reservations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone || !body.date || !body.timeSlot || !body.guestsCount) {
      return NextResponse.json(
        { success: false, error: 'Missing required reservation details' },
        { status: 400 }
      );
    }

    const newRes = db.createReservation({
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || '',
      guestsCount: Number(body.guestsCount),
      date: body.date,
      timeSlot: body.timeSlot,
      seatingArea: body.seatingArea || 'Indoor Main',
      specialRequests: body.specialRequests || '',
      occasion: body.occasion || '',
      assignedTable: body.assignedTable || undefined,
    });

    return NextResponse.json({ success: true, data: newRes }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json(
        { success: false, error: 'Reservation ID and status are required' },
        { status: 400 }
      );
    }

    const updated = db.updateReservationStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Reservation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}
