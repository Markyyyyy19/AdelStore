export default function AboutPage() {
  return (
    <div className="container section">
      <h2>🏪 About Adel&apos;Store — SME Story</h2>
      <p>
        <b>Adel&apos;Store</b> is a family-owned sari-sari store SME that started as a small corner shop.
        Our mission: <i>affordable prices, complete products, and neighbor-friendly service.</i>
      </p>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', marginTop: 16 }}>
        <div className="card"><h3>🎯 Mission</h3><div className="muted">To be the most trusted store in the barangay — open every day, with fair prices.</div></div>
        <div className="card"><h3>👁️ Vision</h3><div className="muted">From sari-sari to mini-mart: growing with the community and supporting local suppliers.</div></div>
        <div className="card"><h3>💛 Values</h3><div className="muted">Honesty in every sale, fair credit terms, a clean store, and a smiling cashier.</div></div>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>📊 SME Info</h3>
        <table>
          <tbody>
            <tr><td><b>Business Name</b></td><td>Adel&apos;Store (Sole Proprietorship)</td></tr>
            <tr><td><b>Category</b></td><td>Micro-SME • Retail Sari-Sari</td></tr>
            <tr><td><b>Products</b></td><td>Rice & essentials, canned goods, noodles, snacks, drinks, milk/coffee, household</td></tr>
            <tr><td><b>Services</b></td><td>Walk-in, online orders, GCash, regulars&apos; credit, neighborhood delivery</td></tr>
            <tr><td><b>Hours</b></td><td>Mon–Sun 6:00 AM – 10:00 PM</td></tr>
            <tr><td><b>Staff</b></td><td>2 (Admin + Cashier) — expandable</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
