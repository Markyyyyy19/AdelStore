import path from 'path';
import fs from 'fs';

// Simple JSON file DB — zero native deps, works on any Windows/ hosting.
// File: <project>/data/adelstore.json
function dbPath() {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return path.join(dir, 'adelstore.json');
}

function seedProducts() {
  return [
    { id: 1, name: 'Lucky Me Pancit Canton Original 55g', category: 'Noodles', price: 22, cost: 18, stock: 120, unit: 'pcs', emoji: '🍜', description: 'Best-seller for snacks' },
    { id: 2, name: 'Lucky Me Beef 55g', category: 'Noodles', price: 22, cost: 18, stock: 100, unit: 'pcs', emoji: '🍜', description: 'Beef flavor' },
    { id: 3, name: 'Century Tuna Flakes 155g', category: 'Canned Goods', price: 38, cost: 32, stock: 80, unit: 'can', emoji: '🐟', description: 'Great for meals' },
    { id: 4, name: '555 Sardines Green 155g', category: 'Canned Goods', price: 28, cost: 23, stock: 120, unit: 'can', emoji: '🐟', description: 'Classic sardines' },
    { id: 5, name: 'Argentina Corned Beef 150g', category: 'Canned Goods', price: 52, cost: 44, stock: 60, unit: 'can', emoji: '🥫', description: 'For breakfast' },
    { id: 6, name: 'Mega Sardines Red 155g', category: 'Canned Goods', price: 27, cost: 22, stock: 110, unit: 'can', emoji: '🐟', description: '' },
    { id: 7, name: 'SkyFlakes 24s pack', category: 'Snacks', price: 72, cost: 62, stock: 50, unit: 'pack', emoji: '🍪', description: 'Store bundle pack' },
    { id: 8, name: 'Fudgee Barr Chocolate', category: 'Snacks', price: 9, cost: 7, stock: 200, unit: 'pcs', emoji: '🍫', description: 'Kids’ best-seller' },
    { id: 9, name: 'Piattos Cheese 40g', category: 'Snacks', price: 22, cost: 18, stock: 90, unit: 'pcs', emoji: '🥔', description: '' },
    { id: 10, name: 'Nova Country Cheddar', category: 'Snacks', price: 22, cost: 18, stock: 85, unit: 'pcs', emoji: '🥔', description: '' },
    { id: 11, name: 'Coke Mismo 300ml', category: 'Drinks', price: 25, cost: 20, stock: 120, unit: 'bottle', emoji: '🥤', description: 'Served chilled' },
    { id: 12, name: 'Sprite Mismo 300ml', category: 'Drinks', price: 25, cost: 20, stock: 100, unit: 'bottle', emoji: '🥤', description: '' },
    { id: 13, name: 'Royal Mismo 300ml', category: 'Drinks', price: 25, cost: 20, stock: 90, unit: 'bottle', emoji: '🥤', description: '' },
    { id: 14, name: 'C2 Solo Apple 355ml', category: 'Drinks', price: 28, cost: 23, stock: 70, unit: 'bottle', emoji: '🧃', description: '' },
    { id: 15, name: 'Bear Brand Swak 33g', category: 'Milk & Coffee', price: 14, cost: 11, stock: 150, unit: 'sachet', emoji: '🥛', description: '' },
    { id: 16, name: 'Nescafe Original Twin 48g', category: 'Milk & Coffee', price: 28, cost: 24, stock: 100, unit: 'sachet', emoji: '☕', description: 'Twin pack' },
    { id: 17, name: 'Kopiko Brown 30g', category: 'Milk & Coffee', price: 14, cost: 11, stock: 120, unit: 'sachet', emoji: '☕', description: '' },
    { id: 18, name: 'Milo Sachet 24g', category: 'Milk & Coffee', price: 14, cost: 11, stock: 110, unit: 'sachet', emoji: '🍫', description: '' },
    { id: 19, name: 'Surf Powder Red 65g', category: 'Household', price: 12, cost: 9, stock: 130, unit: 'sachet', emoji: '🧺', description: 'For laundry' },
    { id: 20, name: 'Ariel Powder Green 66g', category: 'Household', price: 14, cost: 11, stock: 110, unit: 'sachet', emoji: '🧺', description: '' },
    { id: 21, name: 'Safeguard White 115g', category: 'Household', price: 42, cost: 35, stock: 60, unit: 'pcs', emoji: '🧼', description: '' },
    { id: 22, name: 'Colgate MaxFresh 95g', category: 'Household', price: 95, cost: 80, stock: 40, unit: 'tube', emoji: '🪥', description: '' },
    { id: 23, name: 'Shampoo Palmolive Sachet 12ml', category: 'Household', price: 9, cost: 7, stock: 180, unit: 'sachet', emoji: '🧴', description: 'Assorted' },
    { id: 24, name: 'Bigas Regular 1kg', category: 'Rice & Essentials', price: 52, cost: 46, stock: 200, unit: 'kg', emoji: '🍚', description: 'Everyday rice' },
    { id: 25, name: 'Itlog Medium (tray 30pcs)', category: 'Rice & Essentials', price: 240, cost: 210, stock: 15, unit: 'tray', emoji: '🥚', description: 'Farm fresh' },
    { id: 26, name: 'Mantika Minola 1L', category: 'Rice & Essentials', price: 98, cost: 85, stock: 30, unit: 'bottle', emoji: '🫗', description: 'For cooking' },
    { id: 27, name: 'Asukal White 1/4kg', category: 'Rice & Essentials', price: 28, cost: 24, stock: 80, unit: 'pack', emoji: '🍬', description: '' },
    { id: 28, name: 'Asin 250g', category: 'Rice & Essentials', price: 12, cost: 8, stock: 90, unit: 'pack', emoji: '🧂', description: '' },
  ];
}

function defaultSettings() {
  return {
    store_name: "Adel'Store",
    gcash_name: 'Adel S.',
    gcash_number: '0951-XXX-XXXX',
    address: 'Purok 5, Barangay Center (near the chapel)',
    hours: 'Open daily 6AM – 10PM',
  };
}

function readDB() {
  const p = dbPath();
  if (!fs.existsSync(p)) {
    const data = { products: seedProducts(), orders: [], suki: [], settings: defaultSettings(), seqProduct: 29, seqOrder: 1 };
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    const data = JSON.parse(raw);
    if (!data.products) data.products = seedProducts();
    if (!data.orders) data.orders = [];
    if (!data.suki) data.suki = [];
    if (!data.settings) data.settings = defaultSettings();
    return data;
  } catch {
    const data = { products: seedProducts(), orders: [], suki: [], settings: defaultSettings(), seqProduct: 29, seqOrder: 1 };
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
    return data;
  }
}

function writeDB(data) {
  fs.writeFileSync(dbPath(), JSON.stringify(data, null, 2));
}

export function getAllProducts(search = '', category = '') {
  const db = readDB();
  let list = db.products;
  if (search) {
    const s = search.toLowerCase();
    list = list.filter((x) => x.name.toLowerCase().includes(s));
  }
  if (category && category !== 'All') {
    list = list.filter((x) => x.category === category);
  }
  return [...list].sort((a, b) => (a.category + a.name).localeCompare(b.category + b.name));
}

export function getCategories() {
  const db = readDB();
  return [...new Set(db.products.map((p) => p.category))].sort();
}

export function createProduct(b) {
  const db = readDB();
  const id = db.seqProduct || Math.max(0, ...db.products.map((p) => p.id)) + 1;
  const prod = {
    id,
    name: b.name,
    category: b.category || 'General',
    price: Number(b.price) || 0,
    cost: Number(b.cost) || 0,
    stock: Number(b.stock) || 0,
    unit: b.unit || 'pcs',
    emoji: b.emoji || '🛒',
    description: b.description || '',
  };
  db.products.push(prod);
  db.seqProduct = id + 1;
  writeDB(db);
  return id;
}

export function updateProduct(b) {
  const db = readDB();
  db.products = db.products.map((p) =>
    p.id === Number(b.id)
      ? { ...p, name: b.name, category: b.category, price: Number(b.price), cost: Number(b.cost), stock: Number(b.stock), unit: b.unit, emoji: b.emoji, description: b.description || '' }
      : p
  );
  writeDB(db);
}

export function deleteProduct(id) {
  const db = readDB();
  db.products = db.products.filter((p) => p.id !== Number(id));
  writeDB(db);
}

export function createOrder({ customer_name, phone, payment, items }) {
  const db = readDB();
  let total = 0;
  const detailed = [];
  for (const it of items) {
    const p = db.products.find((x) => x.id === Number(it.id));
    if (!p) throw new Error(`Product ${it.id} not found`);
    if (p.stock < it.qty) throw new Error(`Low stock for ${p.name} (only ${p.stock} left)`);
    total += p.price * it.qty;
    detailed.push({ product_id: p.id, product_name: p.name, qty: it.qty, price: p.price });
  }
  const orderId = db.seqOrder || db.orders.length + 1;
  const order = {
    id: orderId,
    customer_name: customer_name || 'Walk-in',
    phone: phone || '',
    payment: payment || 'cash',
    total,
    status: payment === 'credit' ? 'unpaid' : 'completed',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    items: detailed,
  };
  for (const d of detailed) {
    const p = db.products.find((x) => x.id === d.product_id);
    p.stock -= d.qty;
  }
  // Lista-suki ledger: track utang balance per customer
  if (payment === 'credit') {
    const name = (customer_name || 'Walk-in').trim() || 'Walk-in';
    let s = db.suki.find((x) => x.name.toLowerCase() === name.toLowerCase());
    if (!s) {
      s = { name, phone: phone || '', balance: 0, updated_at: order.created_at };
      db.suki.push(s);
    }
    s.balance += total;
    s.phone = phone || s.phone;
    s.updated_at = order.created_at;
  }
  db.orders.unshift(order);
  db.seqOrder = orderId + 1;
  writeDB(db);
  return { order_id: orderId, total };
}

export function getOrders() {
  return readDB().orders.slice(0, 100);
}

export function getStats() {
  const db = readDB();
  const today = new Date().toISOString().slice(0, 10);
  const todaySales = db.orders.filter((o) => (o.created_at || '').startsWith(today)).reduce((s, o) => s + o.total, 0);
  const totalSales = db.orders.reduce((s, o) => s + o.total, 0);
  // Last 7 days sales for chart
  const salesByDay = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-PH', { weekday: 'short' });
    const sum = db.orders.filter((o) => (o.created_at || '').startsWith(key)).reduce((s, o) => s + o.total, 0);
    salesByDay.push({ date: key, label, total: sum });
  }
  // Top products by qty sold
  const qtyMap = {};
  for (const o of db.orders) {
    for (const it of o.items || []) {
      qtyMap[it.product_name] = (qtyMap[it.product_name] || 0) + it.qty;
    }
  }
  const topProducts = Object.entries(qtyMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));
  const listaTotal = (db.suki || []).reduce((s, x) => s + (x.balance || 0), 0);
  return {
    totalProducts: db.products.length,
    lowStock: db.products.filter((p) => p.stock <= 10).length,
    todaySales,
    totalSales,
    totalOrders: db.orders.length,
    lowItems: db.products.filter((p) => p.stock <= 10).sort((a, b) => a.stock - b.stock).slice(0, 10),
    recent: db.orders.slice(0, 8),
    salesByDay,
    topProducts,
    listaTotal,
    sukiCount: (db.suki || []).filter((s) => s.balance > 0).length,
  };
}

export function getSettings() {
  const db = readDB();
  return db.settings || defaultSettings();
}

export function saveSettings(s) {
  const db = readDB();
  db.settings = { ...(db.settings || defaultSettings()), ...s };
  writeDB(db);
  return db.settings;
}

export function getSuki() {
  const db = readDB();
  return [...(db.suki || [])].sort((a, b) => (b.balance || 0) - (a.balance || 0));
}

export function paySuki(name, amount) {
  const db = readDB();
  const s = (db.suki || []).find((x) => x.name.toLowerCase() === String(name).toLowerCase());
  if (!s) throw new Error('Customer not found');
  s.balance = Math.max(0, (s.balance || 0) - Number(amount || 0));
  s.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  // log payment as order-like record for history
  db.orders.unshift({
    id: db.seqOrder || db.orders.length + 1,
    customer_name: s.name,
    phone: s.phone || '',
    payment: 'credit-payment',
    total: -Math.abs(Number(amount || 0)),
    status: 'paid',
    created_at: s.updated_at,
    items: [{ product_id: 0, product_name: `Credit payment (${s.name})`, qty: 1, price: -Math.abs(Number(amount || 0)) }],
  });
  db.seqOrder = (db.seqOrder || db.orders.length + 1) + 1;
  writeDB(db);
  return s;
}

export default readDB;
