import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let menu = db.getMenuItems();

    if (category && category !== 'All') {
      menu = menu.filter((item) => item.category === category);
    }

    if (search) {
      const query = search.toLowerCase();
      menu = menu.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, count: menu.length, data: menu });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price and category are required' },
        { status: 400 }
      );
    }

    const newItem = db.createMenuItem({
      name: body.name,
      description: body.description || '',
      price: Number(body.price),
      category: body.category,
      dietary: body.dietary || 'veg',
      spiceLevel: (Math.min(3, Math.max(0, Number(body.spiceLevel) || 0)) as 0 | 1 | 2 | 3),
      calories: body.calories ? Number(body.calories) : undefined,
      prepTimeMinutes: Number(body.prepTimeMinutes) || 15,
      image: body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
      isChefSpecial: Boolean(body.isChefSpecial),
      isBestSeller: Boolean(body.isBestSeller),
      rating: 5.0,
      reviewsCount: 1,
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
