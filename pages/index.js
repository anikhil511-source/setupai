import { useState, useEffect } from 'react';

// ---- Sentiment theme map (warm cream theme) --------------------------------
const THEMES = {
  bullish: { label: 'Opportunity', accent: '#00A37A', dark: '#04342C', strong: '#0F6E56',
             tagText: '#1D9E75', boxBg: '#ECFDF5', boxText: '#065F46', border: '#A7F3D0',
             readBg: '#E4F5EE', readStripe: '#9FE1CB', readTag: '#5DCAA5', readText: '#6E8079', readTime: '#9DB3AB' },
  bearish: { label: 'Caution', accent: '#D85A30', dark: '#4A1B0C', strong: '#993C1D',
             tagText: '#D85A30', boxBg: '#FAECE7', boxText: '#993C1D', border: '#F5C4B3',
             readBg: '#F7EAE3', readStripe: '#F0997B', readTag: '#D89177', readText: '#8A7064', readTime: '#B5A296' },
  neutral: { label: 'Watch', accent: '#BA7517', dark: '#412402', strong: '#854F0B',
             tagText: '#BA7517', boxBg: '#FAEEDA', boxText: '#854F0B', border: '#FAC775',
             readBg: '#F6EEDD', readStripe: '#FAC775', readTag: '#C9A86A', readText: '#8A7B5E', readTime: '#B5A88A' },
};
const themeFor = (s) => THEMES[(s || 'neutral').toLowerCase()] || THEMES.neutral;

// ---- "X ago" helper ----------------------------------------------------------
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return '';
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? 's' : ''} ago`;
}

const TAGLINES = [
  'News that moves your money — before the market reacts.',
  'Your edge in the market starts here.',
  'Trade the news. Beat the crowd.',
  'Real news. Real impact. Real fast.',
  'For traders who move before the herd.',
];

export default function Home() {
  const [cards, setCards] = useState([]);
  const [sentiment, setSentiment] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);  // index of opened card in the visible list
  const [readIds, setReadIds] = useState(() => new Set());  // session-only "read" tracking
  const [tagIndex, setTagIndex] = useState(0);
  const [tagVisible, setTagVisible] = useState(true);

  // Fetch cards whenever the filter changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const url = sentiment === 'All' ? '/api/cards' : `/api/cards?sentiment=${sentiment}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) { setCards(Array.isArray(data) ? data : []); setError(null); }
      } catch (e) {
        if (!cancelled) { setError('Failed to load cards'); setCards([]); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sentiment]);

  // Rotating taglines (fade every 3s)
  useEffect(() => {
    const id = setInterval(() => {
      setTagVisible(false);
      setTimeout(() => {
        setTagIndex((i) => (i + 1) % TAGLINES.length);
        setTagVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // Only show the newest 10 cards in the grid
  const visibleCards = cards.slice(0, 10);

  // Hot Topics = highest-confidence recent cards
  const hotTopics = [...cards]
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 4);

  // Open a card by index, and mark it read (session-only)
  const openCard = (idx) => {
    setActiveIndex(idx);
    const c = visibleCards[idx];
    if (c) setReadIds((prev) => new Set(prev).add(c.id));
  };

  // Open a card by its id within the visible list (so next/prev follows the grid)
  const openById = (id) => {
    const idx = visibleCards.findIndex((c) => c.id === id);
    if (idx !== -1) openCard(idx);
  };

  const filters = ['All', 'Bullish', 'Bearish', 'Neutral'];
  const filterIcon = { All: '◆', Bullish: '▲', Bearish: '▼', Neutral: '■' };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* ---------------- HERO ---------------- */}
      <section style={s.hero}>
        <div style={s.heroBlob} />
        <div style={{ position: 'relative' }}>
          <p style={s.heroEyebrow}>setupai.in</p>
          <h1 style={s.heroTitle}>Market Intelligence, <span style={{ color: '#00C896' }}>Live</span></h1>
          <div style={s.tickerRow}>
            <span style={s.tickerDot} />
            <p style={{ ...s.tickerText, opacity: tagVisible ? 1 : 0 }}>{TAGLINES[tagIndex]}</p>
          </div>
        </div>
      </section>

      {/* ---------------- MAIN LAYOUT ---------------- */}
      <div className="sai-layout" style={s.layout}>

        {/* LEFT — Filters */}
        <aside className="sai-left" style={s.left}>
          <p style={s.colLabel}>Filter</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filters.map((f) => {
              const isActive = sentiment === f;
              const t = f === 'All' ? THEMES.bullish : themeFor(f);
              return (
                <button
                  key={f}
                  onClick={() => setSentiment(f)}
                  style={{
                    ...s.filterBtn,
                    background: isActive ? t.accent : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : t.tagText,
                    fontWeight: isActive ? 700 : 500,
                    border: isActive ? 'none' : '1px solid #E4DCCE',
                  }}
                >
                  <span style={{ fontSize: 11 }}>{filterIcon[f]}</span> {f}
                </button>
              );
            })}
          </div>
          <p style={{ ...s.colLabel, marginTop: 20, color: '#BFB39C' }}>Sector · soon</p>
          <p style={{ fontSize: 11, color: '#BFB39C', lineHeight: 1.9, margin: 0 }}>
            Banking · Energy<br />IT · Pharma · Auto
          </p>
        </aside>

        {/* CENTER — Grid */}
        <main style={s.center}>
          <p style={s.colLabel}>Latest · tap to open</p>

          {loading && <div style={s.muted}>Loading market intelligence…</div>}
          {error && <div style={{ ...s.muted, color: '#F0997B' }}>{error}</div>}
          {!loading && !error && visibleCards.length === 0 && (
            <div style={s.muted}>No news in this filter right now. Check back soon.</div>
          )}

          {!loading && visibleCards.length > 0 && (
            <div className="sai-grid" style={s.grid}>
              {visibleCards.map((card, idx) => {
                const t = themeFor(card.sentiment);
                const isRead = readIds.has(card.id);
                return (
                  <button key={card.id} onClick={() => openCard(idx)}
                    style={{
                      ...s.tile,
                      background: isRead ? t.readBg : '#FFFFFF',
                      borderLeft: `3px solid ${isRead ? t.readStripe : t.accent}`,
                      boxShadow: isRead ? 'none' : '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                    <div>
                      <span style={{ ...s.tileTag, color: isRead ? t.readTag : t.tagText }}>
                        {card.sentiment || 'Neutral'}{card.sector ? ` · ${card.sector}` : ''}{isRead ? ' · ✓ Read' : ''}
                      </span>
                      <p style={{ ...s.tileTitle, color: isRead ? t.readText : '#1A2B2E' }}>{card.title || 'Untitled'}</p>
                    </div>
                    <span style={{ ...s.tileTime, color: isRead ? t.readTime : '#A89A82' }}>{timeAgo(card.pubDate || card.createdAt)}</span>
                  </button>
                );
              })}
            </div>
          )}
        </main>

        {/* RIGHT — Hot Topics */}
        <aside className="sai-right" style={s.right}>
          <p style={{ ...s.colLabel, color: '#D85A30' }}>🔥 Hot topics</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {hotTopics.length === 0 && <p style={{ fontSize: 11, color: '#A89A82' }}>—</p>}
            {hotTopics.map((card) => (
              <button key={`hot-${card.id}`} onClick={() => openById(card.id)} style={s.hotItem}>
                <span style={s.hotScore}>{card.confidence || 0}/10</span>
                <p style={s.hotTitle}>{card.title || 'Untitled'}</p>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* ---------------- FULL CARD MODAL ---------------- */}
      {activeIndex !== null && visibleCards[activeIndex] && (
        <FullCard
          card={visibleCards[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrev={activeIndex > 0 ? () => setActiveIndex(activeIndex - 1) : null}
          onNext={activeIndex < visibleCards.length - 1 ? () => setActiveIndex(activeIndex + 1) : null}
          current={activeIndex + 1}
          total={visibleCards.length}
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .sai-layout { grid-template-columns: 1fr !important; }
          .sai-grid { grid-template-columns: 1fr 1fr !important; }
          .sai-left, .sai-right { order: 0; }
        }
        @media (max-width: 520px) {
          .sai-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ============================ FULL CARD (modal) ==============================
function FullCard({ card, onClose, onPrev, onNext, current, total }) {
  const t = themeFor(card.sentiment);
  const published = timeAgo(card.pubDate || card.createdAt);
  const progressPct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div onClick={onClose} style={s.overlay}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...s.modal, border: `1px solid ${t.border}` }}>
        <button onClick={onClose} style={s.close} aria-label="Close">✕</button>

        {/* Reading progress bar */}
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, width: `${progressPct}%`, background: t.accent }} />
        </div>
        <p style={s.progressLabel}>{current} of {total}</p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <span style={{ ...s.badge, color: t.dark, background: t.boxBg }}>{t.label}</span>
          {card.ticker && <span style={{ ...s.badge, color: t.dark, background: t.border }}>{card.ticker}</span>}
          {card.sector && <span style={{ ...s.badge, color: t.strong, background: 'transparent', border: `1px solid ${t.accent}` }}>{card.sector}</span>}
        </div>

        <h2 style={s.modalTitle}>{card.title || 'Untitled'}</h2>
        <p style={s.modalSummary}>{card.summary || 'No summary available'}</p>

        <div style={s.metrics}>
          <Metric t={t} label="Sentiment" value={card.sentiment || 'Neutral'} />
          <Metric t={t} label="Confidence" value={`${card.confidence || 0}/10`} />
          <Metric t={t} label="Risk level" value={(card.riskLevel || 'MEDIUM').toUpperCase()} />
          <Metric t={t} label="Why it matters" value={card.recommendation || '—'} small />
        </div>

        {card.analysis && (
          <div style={{ ...s.analysisBox, background: t.boxBg }}>
            <p style={{ ...s.analysisLabel, color: t.strong }}>ANALYSIS</p>
            <p style={s.analysisText}>{card.analysis}</p>
          </div>
        )}

        <div style={s.modalFooter}>
          <span>🕐 {published}</span>
          {card.url && (
            <a href={card.url} target="_blank" rel="noopener noreferrer" style={s.sourceLink}>
              {card.source || 'Source'} ↗
            </a>
          )}
        </div>

        {/* Navigation buttons — full width, always visible */}
        <div style={s.navBar}>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
            disabled={!onPrev}
            style={{ ...s.navBtn, opacity: onPrev ? 1 : 0.3, cursor: onPrev ? 'pointer' : 'default' }}
          >‹ Previous</button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
            disabled={!onNext}
            style={{ ...s.navBtn, opacity: onNext ? 1 : 0.3, cursor: onNext ? 'pointer' : 'default' }}
          >Next ›</button>
        </div>
      </div>
    </div>
  );
}

function Metric({ t, label, value, small }) {
  return (
    <div style={{ background: t.boxBg, borderRadius: 8, padding: 12 }}>
      <p style={{ fontSize: 10, color: t.strong, margin: '0 0 4px', fontWeight: 700, textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: small ? 13 : 15, color: '#1A1A1A', margin: 0, fontWeight: 700, lineHeight: 1.3 }}>{value}</p>
    </div>
  );
}

// ================================ STYLES =====================================
const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
const s = {
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh', padding: 16, boxSizing: 'border-box' },

  hero: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '36px 28px',
          position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid #ECE4D6' },
  heroBlob: { position: 'absolute', top: -40, right: -30, width: 200, height: 200, background: 'rgba(0,163,122,0.16)', borderRadius: '50%' },
  heroEyebrow: { fontSize: 11, color: '#5DCAA5', margin: '0 0 8px', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 34, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -1, lineHeight: 1.1 },
  tickerRow: { margin: '14px 0 0', height: 24, display: 'flex', alignItems: 'center', gap: 10 },
  tickerDot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#00C896', flexShrink: 0 },
  tickerText: { fontSize: 15, color: '#C8E9DF', margin: 0, fontWeight: 500, transition: 'opacity 0.4s ease' },

  layout: { display: 'grid', gridTemplateColumns: '150px 1fr 190px', gap: 16, marginTop: 16 },
  left: {}, center: {}, right: {},
  colLabel: { fontSize: 10, color: '#A89A82', margin: '0 0 10px', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' },

  filterBtn: { textAlign: 'left', fontSize: 13, padding: '9px 12px', borderRadius: 10, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s ease' },

  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  tile: { textAlign: 'left', borderRadius: 12, padding: 13, minHeight: 100, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: 'none', fontFamily: FONT,
          borderLeftWidth: 3, borderLeftStyle: 'solid', transition: 'all 0.15s ease' },
  tileTag: { fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3 },
  tileTitle: { fontSize: 12.5, margin: '6px 0 0', lineHeight: 1.3, fontWeight: 500 },
  tileTime: { fontSize: 10, marginTop: 8 },

  hotItem: { textAlign: 'left', background: '#FFFFFF', borderRadius: 10, padding: 10,
             border: '1px solid #ECE4D6', cursor: 'pointer', fontFamily: FONT },
  hotScore: { fontSize: 9, color: '#00A37A', fontWeight: 700 },
  hotTitle: { fontSize: 11.5, color: '#3A3228', margin: '3px 0 0', lineHeight: 1.3 },

  muted: { fontSize: 13, color: '#A89A82', padding: '20px 0' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(40,30,20,0.45)', display: 'flex',
             alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 },
  modal: { background: '#FFFDF9', borderRadius: 16, padding: 22, maxWidth: 440, width: '100%',
           maxHeight: '88vh', overflowY: 'auto', position: 'relative', fontFamily: FONT },
  close: { position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.06)', border: 'none',
           width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 13, color: '#444' },
  badge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.3 },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#1A2B2E', margin: '0 0 8px', lineHeight: 1.25, letterSpacing: -0.5 },
  modalSummary: { fontSize: 13, color: '#5C5347', margin: '0 0 16px', lineHeight: 1.55 },
  metrics: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 },
  analysisBox: { borderRadius: 10, padding: 12, marginBottom: 16 },
  analysisLabel: { fontSize: 11, fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: 0.3 },
  analysisText: { fontSize: 12.5, color: '#1A1A1A', margin: 0, lineHeight: 1.6 },
  modalFooter: { paddingTop: 12, borderTop: '0.5px solid #ECE4D6', display: 'flex', alignItems: 'center',
                 justifyContent: 'space-between', fontSize: 12, color: '#A89A82' },
  sourceLink: { color: '#0D5C6E', textDecoration: 'none', fontWeight: 700 },
  navBar: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 },
  navBtn: { flex: 1, background: '#0D5C6E', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 10,
            fontSize: 14, fontWeight: 700, fontFamily: FONT },
  progressTrack: { height: 5, background: '#ECE4D6', borderRadius: 10, overflow: 'hidden', margin: '0 0 6px' },
  progressFill: { height: '100%', borderRadius: 10, transition: 'width 0.3s ease' },
  progressLabel: { fontSize: 11, color: '#A89A82', fontWeight: 500, margin: '0 0 14px', textAlign: 'right' },
};