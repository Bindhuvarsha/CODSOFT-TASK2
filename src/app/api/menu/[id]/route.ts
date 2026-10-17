import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = db.getMenuItemById(params.id);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve menu item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = db.updateMenuItem(params.id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = db.deleteMenuItem(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}
