import { useState, useEffect } from 'react';
import IntelligenceCard from '../components/IntelligenceCard';
import ToolCard from '../components/ToolCard';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [allCards, setAllCards] = useState([]);
  const [sentiment, setSentiment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    fetchCards(sentiment);
  }, [sentiment]);

  const fetchCards = async (filter) => {
    try {
      setLoading(true);
      const url = filter === 'All' ? '/api/cards' : `/api/cards?sentiment=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setCards(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load cards');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  const featuredTools = [
    { name: 'EMI Calculator', description: 'Calculate monthly EMI', link: '/emi-calculator' },
    { name: 'FIRE Calculator', description: 'Financial Independence Plan', link: '/fire-calculator' },
    { name: 'BMI Calculator', description: 'Check your Body Mass Index', link: '/bmi-calculator' },
  ];

  const moreTools = [
    { name: 'Net Worth Tracker', description: 'Track your wealth', link: '/networth' },
    { name: 'ROI Calculator', description: 'Return on Investment', link: '/roi' },
    { name: 'SIP Calculator', description: 'Systematic Investment Plan', link: '/sip' },
    { name: 'Recurring Deposits', description: 'RD Calculator', link: '/rd' },
    { name: 'HRA Calculator', description: 'House Rent Allowance', link: '/hra' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>INTELLIGENCE</h1>
          <p>AI-Powered Financial Insights, Redefined</p>
        </div>
      </section>

      {/* Intelligence Cards Section */}
      <section className="section">
        <h2 className="section-title">📊 Financial Intelligence Cards</h2>

        <div className="filters">
          {['All', 'Bullish', 'Bearish', 'Neutral'].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${sentiment === filter ? 'active' : ''}`}
              onClick={() => setSentiment(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {loading && <div className="loading">Loading intelligence cards...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && cards.length === 0 && (
          <div className="error">No cards available yet. Check back soon!</div>
        )}

        {!loading && cards.length > 0 && (
          <div className="cards-container">
            {cards.map((card) => (
              <IntelligenceCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Tools Section */}
      <section className="section featured-tools">
        <h2 className="section-title">⚙️ Featured Tools</h2>
        <div className="cards-container">
          {featuredTools.map((tool) => (
            <ToolCard key={tool.name} {...tool} />
          ))}
        </div>
      </section>

      {/* More Tools Section */}
      <section className="section more-section">
        <div style={{ textAlign: 'center' }}>
          <button className="more-toggle" onClick={() => setShowMore(!showMore)}>
            {showMore ? '- Hide More Tools' : '+ More Tools'}
          </button>
        </div>

        {showMore && (
          <div className="more-tools">
            {moreTools.map((tool) => (
              <ToolCard key={tool.name} {...tool} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
