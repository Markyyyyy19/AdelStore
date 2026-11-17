import { getAllProducts, getCategories } from '@/lib/db';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = (await getAllProducts()).slice(0, 8);
  let categories = [];
  try {
    categories = await getCategories();
  } catch {}
  return <HomeClient products={products} categories={categories} />;
}
