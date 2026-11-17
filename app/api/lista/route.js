import { NextResponse } from 'next/server';
import { getSuki, paySuki } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json({ suki: await getSuki() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, amount } = await req.json();
    if (!name || !amount) return NextResponse.json({ error: 'Name and amount are required' }, { status: 400 });
    const s = await paySuki(name, Number(amount));
    return NextResponse.json({ ok: true, suki: s });
  } catch (e) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 400 });
  }
}
