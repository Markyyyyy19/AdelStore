# 🏪 Adel'Store — Sari-Sari SME Full Stack

Affordable, Complete, Neighbor-Friendly. Next.js full stack system with zero-dependency JSON database.

## Features
- 🏠 SME Storefront (home, product catalog, about, contact)
- 🛒 Cart + Checkout (cash / GCash / credit) — automatic stock deduction
- 🧾 POS Cashier mode — fast in-store checkout with printable receipts
- 📱 GCash QR payments — configurable number, auto-generated QR code
- 📊 Admin Dashboard — sales chart (7 days), top sellers, low-stock alerts, inventory CRUD, orders history
- 📒 Customer Credit Ledger — track balances, record payments
- 🗄️ JSON DB auto-created + 28 seeded sari-sari products

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Login
- admin / adel123
- cashier / pos123

## Database
- Local default: MySQL (XAMPP). Set `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB` if needed.
- Serverless/Render mode: set `USE_JSON_DB=true` to use the JSON database at `data/adelstore.json` (seeded with 28 products).

## Deploy
- Render: push repo to GitHub, then use the included `render.yaml` (Blueprint) or create a Web Service with build `npm install && npm run build` and start `npm run start -- -p $PORT`, env `USE_JSON_DB=true`.
- Note: on Render's free tier the filesystem is ephemeral, so the JSON data resets to seed data on redeploys/restarts.

Made with 💛 for neighborhood SMEs.
