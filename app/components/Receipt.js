'use client';
import { peso } from '@/lib/store';

export default function Receipt({ order, settings }) {
  if (!order) return null;
  const s = settings || {};
  return (
    <div id="print-receipt" className="receipt">
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '4px 0' }}>🏪 {s.store_name || "Adel'Store"}</h3>
        <div className="muted" style={{ fontSize: 12 }}>
          {s.address || 'Purok 5, Barangay Center'}
          <br />
          {s.hours || 'Open daily 6AM – 10PM'}
        </div>
        <div style={{ margin: '6px 0', borderTop: '1px dashed #999' }} />
      </div>
      <div style={{ fontSize: 13 }}>
        <div>Order #: <b>#{order.order_id}</b></div>
        <div>Customer: <b>{order.customer_name}</b></div>
        {order.phone ? <div>Phone: {order.phone}</div> : null}
        <div>Payment: <b>{order.payment}</b></div>
        <div>Date: {new Date().toLocaleString('en-PH')}</div>
      </div>
      <div style={{ margin: '6px 0', borderTop: '1px dashed #999' }} />
      <table style={{ width: '100%', fontSize: 13 }}>
        <tbody>
          {(order.items || []).map((i, idx) => (
            <tr key={idx}>
              <td>{i.qty}x {i.product_name || i.name}</td>
              <td style={{ textAlign: 'right' }}>{peso((i.price || 0) * (i.qty || 0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ margin: '6px 0', borderTop: '1px dashed #999' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16 }}>
        <b>TOTAL</b>
        <b>{peso(order.total)}</b>
      </div>
      <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12 }} className="muted">
        Thank you for shopping! Come again 💛
      </div>
      <button className="btn btn-dark btn-sm no-print" style={{ marginTop: 10, width: '100%' }} onClick={() => window.print()}>
        🖨️ Print Receipt
      </button>
    </div>
  );
}
