import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

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
  const [sectorFilter, setSectorFilter] = useState('All');
  const [analystOnly, setAnalystOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [readIds, setReadIds] = useState(() => new Set());
  const [tagIndex, setTagIndex] = useState(0);
  const [tagVisible, setTagVisible] = useState(true);
  const [moodOpen, setMoodOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMoodOpen, setMobileMoodOpen] = useState(false);
  const [hotOpen, setHotOpen] = useState(false);
  const [pendingCards, setPendingCards] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply search + sector + analyst filters
  const filtered = cards.filter((c) => {
    const searchOk = !searchQuery || 
                     (c.ticker || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                     (c.sector || '').toLowerCase().includes(searchQuery.toLowerCase());
    const sectorOk = sectorFilter === 'All' || (c.sector || '') === sectorFilter;
    const analystOk = !analystOnly || c.type === 'Analyst Pick';
    return searchOk && sectorOk && analystOk;
  });

  // Paginate into pages of 8
  const PAGE_SIZE = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visibleCards = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  // Unique sector list for the dropdown (auto-filled from current cards)
  const sectorOptions = ['All', ...Array.from(new Set(cards.map((c) => c.sector).filter(Boolean))).sort()];

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

  // Background check every 60s — detect new cards without disturbing the grid
  useEffect(() => {
    const check = async () => {
      try {
        const url = sentiment === 'All' ? '/api/cards' : `/api/cards?sentiment=${sentiment}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const shownIds = new Set(cards.map((c) => c.id));
        const fresh = data.filter((c) => !shownIds.has(c.id));
        if (fresh.length > 0) {
          setPendingCards(data);
          setNewCount(fresh.length);
        }
      } catch (e) { /* silent */ }
    };
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, [sentiment, cards]);

  // Load the pending (new) cards into the grid when the user taps the pill
  const loadNewCards = () => {
    if (pendingCards) {
      setCards(pendingCards);
      setPendingCards(null);
      setNewCount(0);
      setPage(0);
    }
  };

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

  // Mark the currently-viewed card as read
  useEffect(() => {
    if (activeIndex === null) return;
    const c = visibleCards[activeIndex];
    if (c) setReadIds((prev) => (prev.has(c.id) ? prev : new Set(prev).add(c.id)));
  }, [activeIndex]);

  // Reset to first page whenever any filter changes
  useEffect(() => { setPage(0); }, [sentiment, sectorFilter, analystOnly, searchQuery]);

  // Hot Topics = highest-confidence recent cards
  const hotTopics = [...cards]
    .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 4);

  // Market Mood — % bullish/bearish/neutral over each timeframe
  const moodFor = (days) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const inRange = cards.filter((c) => {
      const d = new Date(c.pubDate || c.createdAt).getTime();
      return !isNaN(d) && d >= cutoff;
    });
    const total = inRange.length;
    if (total === 0) return { bull: 0, bear: 0, neut: 0, total: 0 };
    let bull = 0, bear = 0, neut = 0;
    inRange.forEach((c) => {
      const s = (c.sentiment || 'neutral').toLowerCase();
      if (s === 'bullish') bull++;
      else if (s === 'bearish') bear++;
      else neut++;
    });
    return {
      bull: Math.round((bull / total) * 100),
      bear: Math.round((bear / total) * 100),
      neut: Math.round((neut / total) * 100),
      total,
    };
  };
  const moodTimeframes = [
    { label: 'Daily', m: moodFor(1) },
    { label: 'Weekly', m: moodFor(7) },
  ];

  // Open a card by index
  const openCard = (idx) => {
    setActiveIndex(idx);
    const c = visibleCards[idx];
    if (c) setReadIds((prev) => new Set(prev).add(c.id));
  };

  // Open a card by its id within the visible list
  const openById = (id) => {
    const idx = visibleCards.findIndex((c) => c.id === id);
    if (idx !== -1) openCard(idx);
  };

  const filters = ['All', 'Bullish', 'Bearish', 'Neutral'];
  const filterIcon = { All: '◆', Bullish: '▲', Bearish: '▼', Neutral: '■' };

  return (
    <div style={s.page}>
      <Head>
        <title>SetupAI — AI-Powered Market Intelligence for Indian Traders</title>
        <meta name="description" content="AI-filtered Indian market news that matters — sentiment, analysis, and the stories moving stocks. Cut the noise, catch what counts." />
        <meta property="og:title" content="SetupAI — AI-Powered Market Intelligence" />
        <meta property="og:description" content="AI-filtered Indian market news that matters — sentiment, analysis, and the stories moving stocks." />
        <meta property="og:image" content="/setupai-wide.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* HERO (no blob background, no extra padding) */}
      <section style={s.hero}>
        {/* Nav row inside the teal panel */}
        <div style={s.heroNav}>
          <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
          <div className="sai-desktop-nav" style={s.navLinks}>
            <Link href="/" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>Home</Link>
            <Link href="/about" style={s.navLink}>About</Link>
            <Link href="/tools" style={s.navLink}>Tools</Link>
            <Link href="/events" style={s.navLink}>Events</Link>
          </div>
          <button className="sai-burger" onClick={() => setMenuOpen(true)} style={s.burger} aria-label="Menu">☰</button>
        </div>

        <div style={{ position: 'relative' }}>
          <h1 style={s.heroTitle}>Market Intelligence, <span style={{ color: '#00C896' }}>Live</span></h1>
          <div style={s.tickerRow}>
            <span style={s.tickerDot} />
            <p style={{ ...s.tickerText, opacity: tagVisible ? 1 : 0 }}>{TAGLINES[tagIndex]}</p>
          </div>

          {newCount > 0 && (
            <button onClick={loadNewCards} style={s.newPill}>
              <span style={s.newPillDot} />
              {newCount} new update{newCount > 1 ? 's' : ''} · tap to refresh
            </button>
          )}
        </div>
      </section>

      {/* MOBILE SLIDE-IN MENU */}
      {menuOpen && (
        <div className="sai-menu-overlay" style={s.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div style={s.menuPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.menuHeader}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>setup<span style={{ color: '#00C896' }}>ai</span></span>
              <button onClick={() => setMenuOpen(false)} style={s.menuClose} aria-label="Close">✕</button>
            </div>
            <p style={s.menuTagline}>Your edge in the market</p>

            <div style={s.menuLinks}>
              <Link href="/" style={{ ...s.menuLink, background: '#00A37A', color: '#fff' }}>🏠 Home</Link>

              {/* Market Mood dropdown */}
              <div style={s.menuMoodWrap}>
                <button onClick={() => setMobileMoodOpen((v) => !v)} style={{ ...s.menuLink, ...s.menuMoodHead, background: mobileMoodOpen ? '#ECF7F3' : '#fff' }}>
                  <span>📊 Market Mood</span>
                  <span style={{ color: '#0D5C6E', fontSize: 12 }}>{mobileMoodOpen ? '▴' : '▾'}</span>
                </button>
                {mobileMoodOpen && (
                  <div style={s.menuMoodBody}>
                    {moodTimeframes.map((tf) => (
                      <div key={tf.label} style={{ marginBottom: 9 }}>
                        <span style={s.moodLabel}>{tf.label}</span>
                        <div style={s.moodTrack}>
                          {tf.m.total === 0 ? <div style={{ width: '100%', background: '#F0EADF' }} /> : (
                            <>
                              <div style={{ width: `${tf.m.bull}%`, background: '#00A37A' }} />
                              <div style={{ width: `${tf.m.bear}%`, background: '#D85A30' }} />
                              <div style={{ width: `${tf.m.neut}%`, background: '#E8C57A' }} />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <div style={s.moodLegend}>
                      <span style={{ fontSize: 9, color: '#1D9E75' }}>● Bullish</span>
                      <span style={{ fontSize: 9, color: '#D85A30' }}>● Bearish</span>
                      <span style={{ fontSize: 9, color: '#BA8A30' }}>● Neutral</span>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/tools" style={s.menuLink}>🧰 Tools</Link>
              <Link href="/about" style={s.menuLink}>ℹ️ About</Link>
              <Link href="/events" style={s.menuLink}>📅 Events Calendar</Link>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE HOT TOPICS BAR */}
      <div className="sai-mobile-hotbar" style={s.hotBar}>
        <button onClick={() => setHotOpen((v) => !v)} style={s.hotBarHead}>
          <span style={{ fontSize: 12, color: '#D85A30', fontWeight: 700 }}>🔥 Hot Topics <span style={{ color: '#A89A82', fontWeight: 500 }}>({hotTopics.length})</span></span>
          <span style={{ color: '#D85A30', fontSize: 12 }}>{hotOpen ? '▴' : '▾'}</span>
        </button>
        {hotOpen && (
          <div style={s.hotBarBody}>
            {hotTopics.map((card) => (
              <button key={`mhot-${card.id}`} onClick={() => openById(card.id)} style={s.hotItem}>
                <span style={s.hotScore}>{card.confidence || 0}/10</span>
                <p style={s.hotTitle}>{card.title || 'Untitled'}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN LAYOUT */}
      <div className="sai-layout" style={s.layout}>

        {/* LEFT — Filters */}
        <aside className="sai-left" style={s.left}>
          <p style={s.colLabel}>Filter</p>
          <div className="sai-filter-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
          <div className="sai-type-divider" style={{ height: 1, background: '#E4DCCE', margin: '16px 0' }} />
          <p className="sai-type-label" style={{ ...s.colLabel }}>Type</p>
          <button
            onClick={() => setAnalystOnly((v) => !v)}
            style={{
              ...s.filterBtn,
              width: '100%',
              background: analystOnly ? '#0D5C6E' : '#FFFFFF',
              color: analystOnly ? '#FFFFFF' : '#0D5C6E',
              fontWeight: analystOnly ? 700 : 600,
              border: analystOnly ? 'none' : '1px solid #BFD9D3',
            }}
          >
            <span style={{ fontSize: 11 }}>⭐</span> Analyst Picks
          </button>
        </aside>

        {/* CENTER — Grid */}
        <main style={s.center}>
          <div style={s.gridHeader}>
            <p style={{ ...s.colLabel, margin: 0 }}>Latest · tap to open</p>
            
            {/* SEARCH BOX FIRST */}
            <input
              type="text"
              placeholder="Search ticker, company, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={s.searchInput}
            />

            {/* SECTOR FILTER SECOND */}
            <div style={s.sectorWrap}>
              <span style={s.sectorLabel}>Sector:</span>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                style={s.sectorSelect}
              >
                {sectorOptions.map((sec) => (
                  <option key={sec} value={sec}>{sec === 'All' ? 'All sectors' : sec}</option>
                ))}
              </select>
            </div>
          </div>

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

          {/* Pagination */}
          {!loading && filtered.length > PAGE_SIZE && (
            <div style={s.pagination}>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                style={{ ...s.pageBtn, ...(safePage === 0 ? s.pageBtnDisabled : s.pageBtnActive) }}
              >‹ Prev</button>
              <span style={s.pageLabel}>Page {safePage + 1} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                style={{ ...s.pageBtn, ...(safePage >= totalPages - 1 ? s.pageBtnDisabled : s.pageBtnActive) }}
              >Next ›</button>
            </div>
          )}
        </main>

        {/* RIGHT — Market Mood + Hot Topics */}
        <aside className="sai-right" style={s.right}>

          {/* Market Mood meter (collapsible) */}
          <div
            style={{ ...s.moodBox, borderColor: moodOpen ? '#BFD9D3' : '#ECE4D6' }}
            onMouseEnter={() => setMoodOpen(true)}
            onMouseLeave={() => setMoodOpen(false)}
          >
            <div style={s.moodHeader} onClick={() => setMoodOpen((v) => !v)}>
              <span style={s.moodTitle}>📊 Market Mood</span>
              <span style={{ color: '#0D5C6E', fontSize: 12 }}>{moodOpen ? '▴' : '▾'}</span>
            </div>

            {moodTimeframes.map((tf, i) => {
              if (!moodOpen && i > 1) return null;
              return (
                <div key={tf.label} style={{ marginBottom: i === moodTimeframes.length - 1 ? 0 : 11 }}>
                  <span style={s.moodLabel}>{tf.label}</span>
                  <div style={s.moodTrack}>
                    {tf.m.total === 0 ? (
                      <div style={{ width: '100%', background: '#F0EADF' }} />
                    ) : (
                      <>
                        <div style={{ width: `${tf.m.bull}%`, background: '#00A37A' }} />
                        <div style={{ width: `${tf.m.bear}%`, background: '#D85A30' }} />
                        <div style={{ width: `${tf.m.neut}%`, background: '#E8C57A' }} />
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {moodOpen && (
              <div style={s.moodLegend}>
                <span style={{ fontSize: 9, color: '#1D9E75' }}>● Bullish</span>
                <span style={{ fontSize: 9, color: '#D85A30' }}>● Bearish</span>
                <span style={{ fontSize: 9, color: '#BA8A30' }}>● Neutral</span>
              </div>
            )}
          </div>

          {/* Hot Topics */}
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

      {/* FULL CARD MODAL */}
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

      {/* FOOTER */}
      <footer style={s.footer}>
        <span>© {new Date().getFullYear()} <span style={{ fontWeight: 700 }}>setup<span style={{ color: '#00C896' }}>ai</span></span> · setupai.in</span>
        <div style={s.footerLinks}>
          <Link href="/" style={s.footerLink}>Home</Link>
          <Link href="/about" style={s.footerLink}>About</Link>
          <Link href="/tools" style={s.footerLink}>Tools</Link>
          <Link href="/events" style={s.footerLink}>Events</Link>
        </div>
        <p style={s.disclaimer}>
          Financial news and information for educational purposes only.
          Nothing here is investment advice. Always do your own research.
        </p>
      </footer>

      <style>{`
        @keyframes saiPulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @media (max-width: 860px) {
          .sai-layout { grid-template-columns: 1fr !important; }
          .sai-grid { grid-template-columns: 1fr 1fr !important; }
          .sai-desktop-nav { display: none !important; }
          .sai-burger { display: block !important; }
          .sai-right { display: none !important; }
          .sai-mobile-hotbar { display: block !important; }
          .sai-left { order: 0; }
          .sai-filter-list { flex-direction: row !important; flex-wrap: wrap !important; gap: 6px !important; }
          .sai-filter-list button { flex: none !important; }
          .sai-type-divider { display: none !important; }
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

        {/* FIXED TOP — close + progress */}
        <div style={s.modalTop}>
          <button onClick={onClose} style={s.close} aria-label="Close">✕</button>
          <div style={s.progressTrack}>
            <div style={{ ...s.progressFill, width: `${progressPct}%`, background: t.accent }} />
          </div>
          <p style={s.progressLabel}>{current} of {total}</p>
        </div>

        {/* SCROLLABLE MIDDLE — content */}
        <div style={s.modalBody}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
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
        </div>

        {/* FIXED BOTTOM — nav buttons always visible */}
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
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh', boxSizing: 'border-box', margin: 0, padding: 0 },

  // HERO - rounded rectangular
  hero: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '18px 28px 32px',
          position: 'relative', overflow: 'hidden', margin: 16, borderRadius: 16 },
  heroNav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: 22 },
  logo: { fontSize: 19, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 22 },
  navLink: { fontSize: 14, color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  burger: { display: 'none', background: 'transparent', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1 },

  menuOverlay: { position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.45)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' },
  menuPanel: { width: '78%', maxWidth: 320, height: '100%', background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF6EF 100%)', boxShadow: '-10px 0 30px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  menuHeader: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  menuClose: { background: 'transparent', border: 'none', color: '#9FE1CB', fontSize: 18, cursor: 'pointer' },
  menuTagline: { fontSize: 11, color: '#0D5C6E', margin: '14px 18px 4px', fontWeight: 500 },
  menuLinks: { padding: '8px 12px 20px', display: 'flex', flexDirection: 'column', gap: 7 },
  menuLink: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', borderRadius: 11, background: '#fff', border: '1px solid #ECE4D6', fontSize: 14, color: '#1A2B2E', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, cursor: 'pointer' },
  menuMoodWrap: { border: '1px solid #BFD9D3', borderRadius: 11, overflow: 'hidden' },
  menuMoodHead: { width: '100%', justifyContent: 'space-between', border: 'none', borderRadius: 0 },
  menuMoodBody: { padding: '12px 13px', background: '#fff' },

  hotBar: { display: 'none', background: '#fff', borderBottom: '1px solid #ECE4D6', margin: '0 16px 12px', borderRadius: 12, border: '1px solid #ECE4D6', overflow: 'hidden' },
  hotBarHead: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', border: 'none', cursor: 'pointer', fontFamily: FONT },
  hotBarBody: { padding: '4px 12px 12px', display: 'flex', flexDirection: 'column', gap: 7, background: '#FBF7F0' },
  heroTitle: { fontSize: 32, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: -1, lineHeight: 1.1 },
  tickerRow: { margin: '14px 0 0', height: 24, display: 'flex', alignItems: 'center', gap: 10 },
  tickerDot: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#00C896', flexShrink: 0 },
  tickerText: { fontSize: 15, color: '#C8E9DF', margin: 0, fontWeight: 500, transition: 'opacity 0.4s ease' },
  newPill: { display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: '#00C896',
             border: 'none', padding: '8px 15px', borderRadius: 20, cursor: 'pointer', fontFamily: FONT,
             fontSize: 12, color: '#04342C', fontWeight: 700, boxShadow: '0 2px 10px rgba(0,200,150,0.35)' },
  newPillDot: { width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'saiPulse 1.6s infinite' },

  layout: { display: 'grid', gridTemplateColumns: '150px 1fr 190px', gap: 16, margin: '0 16px 16px', padding: 0 },
  left: {}, center: {}, right: {},
  colLabel: { fontSize: 10, color: '#A89A82', margin: '0 0 10px', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' },

  gridHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  searchInput: { padding: '8px 12px', fontSize: 12, border: '1px solid #E4DCCE', borderRadius: 8, background: '#fff', fontFamily: FONT, boxSizing: 'border-box', maxWidth: 300, minWidth: 200 },
  searchSectorRow: { display: 'flex', alignItems: 'center', gap: 8 },
  sectorWrap: { display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #E4DCCE', borderRadius: 8, padding: '5px 10px' },
  sectorLabel: { fontSize: 11, color: '#A89A82', fontWeight: 500 },
  sectorSelect: { border: 'none', background: 'transparent', fontSize: 12, color: '#4A4236', fontWeight: 600, fontFamily: FONT, cursor: 'pointer', outline: 'none' },

  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 16 },
  pageBtn: { border: 'none', fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 9, fontFamily: FONT },
  pageBtnActive: { background: '#0D5C6E', color: '#fff', cursor: 'pointer' },
  pageBtnDisabled: { background: '#ECE4D6', color: '#A89A82', cursor: 'default' },
  pageLabel: { fontSize: 11, color: '#A89A82', fontWeight: 500 },

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

  moodBox: { background: '#fff', border: '1px solid #ECE4D6', borderRadius: 11, padding: 14, marginBottom: 18, cursor: 'pointer' },
  moodHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  moodTitle: { fontSize: 11, color: '#0D5C6E', fontWeight: 700 },
  moodLabel: { fontSize: 10, color: '#5C5347', fontWeight: 600, display: 'block', marginBottom: 4 },
  moodTrack: { height: 7, background: '#F0EADF', borderRadius: 6, overflow: 'hidden', display: 'flex' },
  moodLegend: { display: 'flex', gap: 10, marginTop: 12, paddingTop: 10, borderTop: '1px solid #F0EADF' },
  hotTitle: { fontSize: 11.5, color: '#3A3228', margin: '3px 0 0', lineHeight: 1.3 },

  muted: { fontSize: 13, color: '#A89A82', padding: '20px 0' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(40,30,20,0.45)', display: 'flex',
             alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 1000 },
  modal: { background: '#FFFDF9', borderRadius: 16, maxWidth: 420, width: '100%',
           maxHeight: '90vh', position: 'relative', fontFamily: FONT,
           display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  modalTop: { padding: '16px 22px 0', flexShrink: 0 },
  modalBody: { padding: '4px 22px', overflowY: 'auto', flex: 1 },
  close: { position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.06)', border: 'none',
           width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 13, color: '#444', zIndex: 2 },
  badge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.3 },
  modalTitle: { fontSize: 19, fontWeight: 700, color: '#1A2B2E', margin: '0 0 6px', lineHeight: 1.25, letterSpacing: -0.5 },
  modalSummary: { fontSize: 13, color: '#5C5347', margin: '0 0 14px', lineHeight: 1.5 },
  metrics: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 },
  analysisBox: { borderRadius: 10, padding: 11, marginBottom: 14 },
  analysisLabel: { fontSize: 11, fontWeight: 700, margin: '0 0 5px', textTransform: 'uppercase', letterSpacing: 0.3 },
  analysisText: { fontSize: 12.5, color: '#1A1A1A', margin: 0, lineHeight: 1.55 },
  modalFooter: { paddingTop: 10, paddingBottom: 4, borderTop: '0.5px solid #ECE4D6', display: 'flex', alignItems: 'center',
                 justifyContent: 'space-between', fontSize: 12, color: '#A89A82' },
  sourceLink: { color: '#0D5C6E', textDecoration: 'none', fontWeight: 700 },
  navBar: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px 18px', flexShrink: 0,
            borderTop: '0.5px solid #ECE4D6', background: '#FFFDF9' },
  navBtn: { flex: 1, background: '#0D5C6E', color: '#fff', border: 'none', padding: '12px 16px', borderRadius: 10,
            fontSize: 14, fontWeight: 700, fontFamily: FONT },
  progressTrack: { height: 5, background: '#ECE4D6', borderRadius: 10, overflow: 'hidden', margin: '0 0 6px' },
  progressFill: { height: '100%', borderRadius: 10, transition: 'width 0.3s ease' },
  progressLabel: { fontSize: 11, color: '#A89A82', fontWeight: 500, margin: '0 0 10px', textAlign: 'right' },

  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: '28px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};