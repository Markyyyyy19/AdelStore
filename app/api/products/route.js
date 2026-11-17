import { NextResponse } from 'next/server';
import { getAllProducts, getCategories, createProduct, updateProduct, deleteProduct } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  try {
    const products = await getAllProducts(search, category);
    const categories = await getCategories();
    return NextResponse.json({ products, categories });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const b = await req.json();
    const id = await createProduct(b);
    return NextResponse.json({ id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const b = await req.json();
    await updateProduct(b);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    await deleteProduct(searchParams.get('id'));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
