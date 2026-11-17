import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({ orders: await getOrders() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { customer_name, phone, payment, items } = await req.json();
    if (!items || items.length === 0) return NextResponse.json({ error: 'Empty items' }, { status: 400 });
    const result = await createOrder({ customer_name, phone, payment, items });
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}
