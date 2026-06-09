export default function Card({ card }) {
  const colors = {
    green: { bg: '#f0fdf4', text: '#166534', border: '#22c55e' },
    red: { bg: '#fef2f2', text: '#7f1d1d', border: '#ef4444' },
    yellow: { bg: '#fffbeb', text: '#78350f', border: '#f59e0b' }
  };

  const c = colors[card.colorCode] || colors.yellow;

  return (
    <div
      style={{
        backgroundColor: c.bg,
        color: c.text,
        borderLeft: `4px solid ${c.border}`,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>
        {card.title}
      </h3>

      <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
        {card.summary}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div style={{ backgroundColor: c.border + '20', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>TICKER</div>
          <div style={{ fontWeight: 'bold' }}>{card.ticker || 'N/A'}</div>
        </div>
        <div style={{ backgroundColor: c.border + '20', padding: '10px', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>SENTIMENT</div>
          <div style={{ fontWeight: 'bold' }}>{card.sentiment}</div>
        </div>
        <div style={{ backgroundColor: '#fef3c7', padding: '10px', borderRadius: '4px', color: '#b45309' }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>CONFIDENCE</div>
          <div style={{ fontWeight: 'bold' }}>{card.confidence}/10</div>
        </div>
        <div style={{ backgroundColor: '#fef3c7', padding: '10px', borderRadius: '4px', color: '#b45309' }}>
          <div style={{ fontSize: '12px', opacity: 0.7 }}>RISK</div>
          <div style={{ fontWeight: 'bold' }}>{card.riskLevel}</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '4px', marginBottom: '10px', fontSize: '13px' }}>
        <strong>Analysis:</strong> {card.analysis}
      </div>

      <div style={{
        backgroundColor: '#eff6ff',
        border: '1px solid #bfdbfe',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        color: '#1e40af'
      }}>
        <strong>⚠️ DISCLAIMER:</strong> For educational purposes only. NOT financial advice. Do your own research.
      </div>
    </div>
  );
}