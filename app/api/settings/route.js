import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json(await getSettings());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const b = await req.json();
    const s = await saveSettings({
      store_name: b.store_name,
      gcash_name: b.gcash_name,
      gcash_number: b.gcash_number,
      address: b.address,
      hours: b.hours,
    });
    return NextResponse.json(s);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
