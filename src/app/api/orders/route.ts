import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let orders = db.getOrders();

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    if (type) {
      orders = orders.filter((o) => o.type === type);
    }

    return NextResponse.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items || !body.items.length) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!body.customer || !body.customer.name || !body.customer.phone) {
      return NextResponse.json(
        { success: false, error: 'Customer name and phone number are required' },
        { status: 400 }
      );
    }

    const newOrder = db.createOrder({
      type: body.type || 'dine-in',
      status: 'placed',
      items: body.items,
      customer: body.customer,
      paymentMethod: body.paymentMethod || 'card',
      paymentStatus: body.paymentStatus || 'paid',
      subtotal: Number(body.subtotal) || 0,
      discount: Number(body.discount) || 0,
      promoCode: body.promoCode || undefined,
      tax: Number(body.tax) || 0,
      serviceCharge: Number(body.serviceCharge) || 0,
      tip: Number(body.tip) || 0,
      total: Number(body.total) || 0,
      estimatedPrepTimeMinutes: Number(body.estimatedPrepTimeMinutes) || 20,
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to place order' },
      { status: 500 }
    );
  }
}
