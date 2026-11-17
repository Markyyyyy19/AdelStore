'use client';

export default function GcashQR({ settings, amount }) {
  const number = settings?.gcash_number || '0951-XXX-XXXX';
  const name = settings?.gcash_name || 'Adel S.';
  const qrData = encodeURIComponent(`GCash ${number} ${name} ${amount ? 'Amount:' + amount : ''}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;
  return (
    <div className="card" style={{ background: '#007dff', color: '#fff', border: 0 }}>
      <b>📱 Pay via GCash</b>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
        <img src={qrUrl} alt="GCash QR" width={120} height={120} style={{ borderRadius: 12, background: '#fff', padding: 6 }} />
        <div>
          <div style={{ fontSize: 13, opacity: 0.9 }}>Send to:</div>
          <div style={{ fontSize: 22, fontWeight: 900 }}>{number}</div>
          <div style={{ fontSize: 14 }}>{name}</div>
          {amount ? <div style={{ fontSize: 14, fontWeight: 800 }}>Amount: ₱{Number(amount).toFixed(2)}</div> : null}
          <div style={{ fontSize: 12, opacity: 0.9 }}>Take a screenshot of the receipt and show it to the cashier.</div>
        </div>
      </div>
    </div>
  );
}
