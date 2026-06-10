import { useState, useEffect } from 'react';
import Card from '@/component/components/Card';

export default function Intelligence() {
  const [cards, setCards] = useState([]);
  const [sentiment, setSentiment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, [sentiment]);

  async function fetchCards() {
    setLoading(true);
    const url = `/api/cards${sentiment ? `?sentiment=${sentiment}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    setCards(data.data || []);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1>Intelligence Cards</h1>
      <p style={{ color: '#666' }}>Financial market analysis (Informational Only)</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setSentiment('')}
          style={{
            padding: '8px 16px',
            backgroundColor: !sentiment ? '#3b82f6' : '#e5e7eb',
            color: !sentiment ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          All
        </button>
        <button
          onClick={() => setSentiment('Bullish')}
          style={{
            padding: '8px 16px',
            backgroundColor: sentiment === 'Bullish' ? '#16a34a' : '#e5e7eb',
            color: sentiment === 'Bullish' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Bullish
        </button>
        <button
          onClick={() => setSentiment('Bearish')}
          style={{
            padding: '8px 16px',
            backgroundColor: sentiment === 'Bearish' ? '#dc2626' : '#e5e7eb',
            color: sentiment === 'Bearish' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Bearish
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : cards.length === 0 ? (
        <p>No cards yet. Run n8n workflow to fetch articles.</p>
      ) : (
        cards.map(card => <Card key={card.id} card={card} />)
      )}
    </div>
  );
}
