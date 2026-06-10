export default function IntelligenceCard({ card }) {
  if (!card) return null;

  const sentimentColor = {
    Bullish: '#10B981',
    Bearish: '#EF4444',
    Neutral: '#F59E0B',
  };

  const sentimentClass = card.sentiment?.toLowerCase() || 'neutral';

  return (
    <div className={`intelligence-card ${sentimentClass}`}>
      <div className="card-meta">
        {card.ticker && <span className="badge badge-ticker">{card.ticker}</span>}
        <span className="badge badge-sentiment" style={{ backgroundColor: sentimentColor[card.sentiment] || '#F59E0B' }}>
          {card.sentiment || 'Neutral'}
        </span>
      </div>

      <h3 className="card-title">{card.title || 'Untitled'}</h3>

      <p className="card-summary">{card.summary || 'No summary available'}</p>

      <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#666' }}>
        <div>
          <strong>Risk Level:</strong> {card.riskLevel || 'MEDIUM'}
        </div>
        <div>
          <strong>Confidence:</strong> {card.confidence || 0}/10
        </div>
        {card.sector && <div><strong>Sector:</strong> {card.sector}</div>}
      </div>

      {card.analysis && (
        <div style={{ fontSize: '0.9rem', color: '#555', lineHeight: '1.5', borderTop: '1px solid #eee', paddingTop: '10px' }}>
          {card.analysis}
        </div>
      )}

      <div style={{ marginTop: '15px', fontSize: '0.8rem', color: '#999' }}>
        {new Date(card.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
