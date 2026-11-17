import mysql from 'mysql2/promise';

// XAMPP MySQL — database `adelstore` (visible in phpMyAdmin).
// Previously JSON file at data/adelstore.json (kept as backup, see lib/db.json-backup.js).
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'adelstore',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4_unicode_ci',
});

export async function getAllProducts(search = '', category = '') {
  let sql = 'SELECT * FROM products';
  const params = [];
  const conds = [];
  if (search) {
    conds.push('name LIKE ?');
    params.push(`%${search}%`);
  }
  if (category && category !== 'All') {
    conds.push('category = ?');
    params.push(category);
  }
  if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
  sql += ' ORDER BY category, name';
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function getCategories() {
  const [rows] = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
  return rows.map((r) => r.category);
}

export async function createProduct(b) {
  const [r] = await pool.query(
    'INSERT INTO products (name, category, price, cost, stock, unit, emoji, description) VALUES (?,?,?,?,?,?,?,?)',
    [b.name, b.category || 'General', Number(b.price) || 0, Number(b.cost) || 0, Number(b.stock) || 0, b.unit || 'pcs', b.emoji || '', b.description || '']
  );
  return r.insertId;
}

export async function updateProduct(b) {
  await pool.query(
    'UPDATE products SET name=?, category=?, price=?, cost=?, stock=?, unit=?, emoji=?, description=? WHERE id=?',
    [b.name, b.category, Number(b.price), Number(b.cost), Number(b.stock), b.unit, b.emoji, b.description || '', Number(b.id)]
  );
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id=?', [Number(id)]);
}

export async function createOrder({ customer_name, phone, payment, items }) {
  if (!items || items.length === 0) throw new Error('Empty items');
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let total = 0;
    const detailed = [];
    for (const it of items) {
      const [rows] = await conn.query('SELECT * FROM products WHERE id=? FOR UPDATE', [Number(it.id)]);
      const p = rows[0];
      if (!p) throw new Error(`Product ${it.id} not found`);
      if (p.stock < it.qty) throw new Error(`Low stock for ${p.name} (only ${p.stock} left)`);
      total += Number(p.price) * it.qty;
      detailed.push({ product_id: p.id, product_name: p.name, qty: it.qty, price: Number(p.price) });
    }
    const status = payment === 'credit' ? 'unpaid' : 'completed';
    const [o] = await conn.query(
      'INSERT INTO orders (customer_name, phone, payment, total, status) VALUES (?,?,?,?,?)',
      [customer_name || 'Walk-in', phone || '', payment || 'cash', total, status]
    );
    const orderId = o.insertId;
    for (const d of detailed) {
      await conn.query('INSERT INTO order_items (order_id, product_id, product_name, qty, price) VALUES (?,?,?,?,?)', [orderId, d.product_id, d.product_name, d.qty, d.price]);
      await conn.query('UPDATE products SET stock = stock - ? WHERE id=?', [d.qty, d.product_id]);
    }
    if (payment === 'credit') {
      const name = (customer_name || 'Walk-in').trim() || 'Walk-in';
      await conn.query(
        'INSERT INTO suki (name, phone, balance) VALUES (?,?,?) ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance), phone = VALUES(phone)',
        [name, phone || '', total]
      );
    }
    await conn.commit();
    return { order_id: orderId, total };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function getOrders() {
  const [orders] = await pool.query('SELECT * FROM orders ORDER BY id DESC LIMIT 100');
  for (const o of orders) {
    const [items] = await pool.query('SELECT product_id, product_name, qty, price FROM order_items WHERE order_id=?', [o.id]);
    o.items = items;
  }
  return orders;
}

export async function getStats() {
  const [[c1]] = await pool.query('SELECT COUNT(*) AS n FROM products');
  const [[c2]] = await pool.query('SELECT COUNT(*) AS n FROM products WHERE stock <= 10');
  const [[c3]] = await pool.query('SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE DATE(created_at)=CURDATE() AND total>0');
  const [[c4]] = await pool.query('SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE total>0');
  const [[c5]] = await pool.query('SELECT COUNT(*) AS n FROM orders WHERE total>0');
  const [salesByDay] = await pool.query(
    "SELECT DATE_FORMAT(dd.dy,'%Y-%m-%d') AS date, DAYNAME(dd.dy) AS label, COALESCE(SUM(o.total),0) AS total FROM (SELECT CURDATE() - INTERVAL 6 DAY + INTERVAL n DAY AS dy FROM (SELECT 0 n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6) t) dd LEFT JOIN orders o ON DATE(o.created_at)=dd.dy AND o.total>0 GROUP BY dd.dy ORDER BY dd.dy"
  );
  const [topRows] = await pool.query(
    'SELECT product_name AS name, SUM(qty) AS qty FROM order_items GROUP BY product_name ORDER BY qty DESC LIMIT 5'
  );
  const [[lista]] = await pool.query('SELECT COALESCE(SUM(balance),0) AS s FROM suki');
  const [[sukiCount]] = await pool.query('SELECT COUNT(*) AS n FROM suki WHERE balance > 0');
  const [lowItems] = await pool.query('SELECT * FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 10');
  const [recent] = await pool.query('SELECT * FROM orders ORDER BY id DESC LIMIT 8');
  for (const o of recent) {
    const [items] = await pool.query('SELECT product_id, product_name, qty, price FROM order_items WHERE order_id=?', [o.id]);
    o.items = items;
  }
  return {
    totalProducts: c1.n,
    lowStock: c2.n,
    todaySales: Number(c3.s),
    totalSales: Number(c4.s),
    totalOrders: c5.n,
    lowItems,
    recent,
    salesByDay: salesByDay.map((r) => ({ date: r.date, label: String(r.label).slice(0, 3), total: Number(r.total) })),
    topProducts: topRows.map((r) => ({ name: r.name, qty: Number(r.qty) })),
    listaTotal: Number(lista.s),
    sukiCount: sukiCount.n,
  };
}

export async function getSettings() {
  const [rows] = await pool.query('SELECT * FROM settings WHERE id=1');
  return rows[0] || { store_name: "Adel'Store", gcash_name: 'Adel S.', gcash_number: '0951-XXX-XXXX', address: '', hours: '' };
}

export async function saveSettings(s) {
  await pool.query(
    'INSERT INTO settings (id, store_name, gcash_name, gcash_number, address, hours) VALUES (1,?,?,?,?,?) ON DUPLICATE KEY UPDATE store_name=VALUES(store_name), gcash_name=VALUES(gcash_name), gcash_number=VALUES(gcash_number), address=VALUES(address), hours=VALUES(hours)',
    [s.store_name, s.gcash_name, s.gcash_number, s.address, s.hours]
  );
  return getSettings();
}

export async function getSuki() {
  const [rows] = await pool.query('SELECT * FROM suki ORDER BY balance DESC');
  return rows;
}

export async function paySuki(name, amount) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM suki WHERE name=?', [String(name)]);
    const s = rows[0];
    if (!s) throw new Error('Customer not found');
    const amt = Math.abs(Number(amount || 0));
    await conn.query('UPDATE suki SET balance = GREATEST(0, balance - ?) WHERE name=?', [amt, String(name)]);
    await conn.query(
      "INSERT INTO orders (customer_name, phone, payment, total, status) VALUES (?,?,'credit-payment',?,'paid')",
      [s.name, s.phone || '', -amt]
    );
    const orderId = (await conn.query('SELECT LAST_INSERT_ID() AS id'))[0][0].id;
    await conn.query('INSERT INTO order_items (order_id, product_id, product_name, qty, price) VALUES (?,?,?,1,?)', [orderId, 0, `Credit payment (${s.name})`, -amt]);
    await conn.commit();
    const [updated] = await pool.query('SELECT * FROM suki WHERE name=?', [String(name)]);
    return updated[0];
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export default pool;
