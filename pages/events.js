import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";

const EVENTS_DATA = [
  { id: 1, title: 'RBI Policy Decision', date: new Date(2026, 5, 24, 14, 30), impact: 'High', type: 'RBI', description: 'The Reserve Bank of India announces its monetary policy decision.', color: '#D85A30' },
  { id: 2, title: 'TCS Q1 FY27 Earnings', date: new Date(2026, 5, 25, 16, 0), impact: 'Medium', type: 'Earnings', description: 'Tata Consultancy Services reports Q1 earnings.', color: '#BA7517' },
  { id: 3, title: 'US Fed Interest Rate Decision', date: new Date(2026, 5, 26, 18, 30), impact: 'High', type: 'Global', description: 'Federal Reserve announces its latest policy decision.', color: '#00A37A' },
  { id: 4, title: 'Infosys Q1 FY27 Results', date: new Date(2026, 5, 27, 10, 0), impact: 'Medium', type: 'Earnings', description: 'Infosys reports Q1 results with FY27 guidance.', color: '#BA7517' },
  { id: 5, title: 'HDFC Bank AGM', date: new Date(2026, 5, 28, 15, 0), impact: 'Low', type: 'Corporate', description: 'Annual General Meeting of shareholders.', color: '#999' },
  { id: 6, title: 'ITC Q1 FY27 Earnings', date: new Date(2026, 5, 30, 14, 30), impact: 'Medium', type: 'Earnings', description: 'ITC reports Q1 earnings.', color: '#BA7517' },
  { id: 7, title: 'SEBI Board Meeting', date: new Date(2026, 6, 5, 10, 0), impact: 'High', type: 'RBI', description: 'Securities and Exchange Board of India board meeting.', color: '#D85A30' },
  { id: 8, title: 'Reliance Q1 Earnings', date: new Date(2026, 6, 10, 14, 0), impact: 'High', type: 'Earnings', description: 'Reliance Industries reports Q1 earnings.', color: '#BA7517' },
];

export default function Events() {
  const [selectedEventType, setSelectedEventType] = useState('All');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5));
  const [view, setView] = useState('Monthly');
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventPage, setEventPage] = useState(0);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [yearlyMonth, setYearlyMonth] = useState(null);
  const [showPastDates, setShowPastDates] = useState(false);
  const [hoveredMiniMonth, setHoveredMiniMonth] = useState(null);
  const [upcomingOpen, setUpcomingOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationEnabled(true);
        scheduleNotifications();
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            setNotificationEnabled(true);
            scheduleNotifications();
          }
        });
      }
    }
  }, []);

  const scheduleNotifications = () => {
    EVENTS_DATA.forEach((event) => {
      const timeTillEvent = event.date.getTime() - Date.now();
      const fifteenMinsMs = 15 * 60 * 1000;
      if (timeTillEvent > 0) {
        const timeoutMs = timeTillEvent - fifteenMinsMs;
        if (timeoutMs > 0) {
          setTimeout(() => {
            new Notification(`Upcoming: ${event.title}`, {
              body: `Starting in 15 minutes at ${event.date.toLocaleTimeString()}`,
              icon: '/favicon-192.png',
            });
          }, timeoutMs);
        }
      }
    });
  };

  const filteredEvents = selectedEventType === 'All' ? EVENTS_DATA : EVENTS_DATA.filter((e) => e.type === selectedEventType);
  const EVENTS_PER_PAGE = 6;
  const nextEvents = filteredEvents.sort((a, b) => a.date - b.date).slice(eventPage * EVENTS_PER_PAGE, (eventPage + 1) * EVENTS_PER_PAGE);
  const totalEventPages = Math.ceil(filteredEvents.sort((a, b) => a.date - b.date).length / EVENTS_PER_PAGE);

  const eventTypes = ['All', 'RBI', 'Earnings', 'Corporate', 'Global'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < firstDay; i++) currentWeek.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const visibleWeeks = showPastDates ? weeks : weeks.filter((week) => {
    const hasCurrentOrFuture = week.some((day) => {
      if (!day) return false;
      const date = new Date(year, month, day);
      return date >= new Date(year, month, today.getDate());
    });
    return hasCurrentOrFuture;
  });

  const monthEvents = filteredEvents.filter((e) => {
    return e.date.getFullYear() === year && e.date.getMonth() === month;
  });

  const getEventColor = (day) => {
    const dayEvents = monthEvents.filter((e) => e.date.getDate() === day);
    return dayEvents.length > 0 ? dayEvents[0].color : null;
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={s.page}>
      <Head>
        <title>Market Events Calendar — SetupAI</title>
        <meta name="description" content="Upcoming market events, earnings, and RBI meetings that impact Indian stocks." />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div className="desktop-nav" style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={s.navLink}>About</Link>
          <Link href="/tools" style={s.navLink}>Tools</Link>
          <Link href="/events" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>Events</Link>
        </div>
        <button className="burger-menu" onClick={() => setMenuOpen(true)} style={s.burger} aria-label="Menu">☰</button>
      </nav>

      {menuOpen && (
        <div className="sai-menu-overlay" style={s.menuOverlay} onClick={() => setMenuOpen(false)}>
          <div style={s.menuPanel} onClick={(e) => e.stopPropagation()}>
            <div style={s.menuHeader}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>setup<span style={{ color: '#00C896' }}>ai</span></span>
              <button onClick={() => setMenuOpen(false)} style={s.menuClose} aria-label="Close">✕</button>
            </div>
            <p style={s.menuTagline}>Your edge in the market</p>

            <div style={s.menuLinks}>
              <Link href="/" style={s.menuLink}>🏠 Home</Link>
              <Link href="/about" style={s.menuLink}>ℹ️ About</Link>
              <Link href="/tools" style={s.menuLink}>🧰 Tools</Link>
              <Link href="/events" style={{ ...s.menuLink, background: '#00A37A', color: '#fff' }}>📅 Events Calendar</Link>
            </div>
          </div>
        </div>
      )}

      <div style={s.container}>
        <main style={s.main}>
          <h1 style={s.pageTitle}>Market Events Calendar</h1>

          {/* MOBILE: Upcoming events at TOP (Collapsible) */}
          <div className="sai-upcoming-mobile" style={s.upcomingMobileSection}>
            <button onClick={() => setUpcomingOpen(!upcomingOpen)} style={s.upcomingBtn}>
              <span>📌 This Week's Events ({filteredEvents.filter(e => e.date.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000).length})</span>
              <span style={{ color: '#0D5C6E', fontSize: 12 }}>{upcomingOpen ? '▴' : '▾'}</span>
            </button>
            
            {upcomingOpen && (
              <div style={s.upcomingList}>
                {filteredEvents.filter(e => e.date.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000).slice(0, 3).map((event) => (
                  <div key={event.id} style={{ ...s.upcomingEvent, borderLeft: `3px solid ${event.color}` }}>
                    <p style={s.upcomingTitle}>{event.title}</p>
                    <p style={s.upcomingTime}>{event.date.toLocaleDateString('en-IN')} • {event.impact} Impact</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile: Filters in ONE LINE */}
          <div className="sai-filters-mobile" style={s.filterRowMobile}>
            <select value={view} onChange={(e) => setView(e.target.value)} style={s.filterSelectMobile}>
              <option value="Monthly">📅 Monthly</option>
              <option value="Yearly">📆 Yearly</option>
              <option value="List">📋 List</option>
            </select>
            
            <select value={selectedEventType} onChange={(e) => setSelectedEventType(e.target.value)} style={s.filterSelectMobile}>
              <option value="All">🔽 All Types</option>
              <option value="RBI">🏦 RBI</option>
              <option value="Earnings">💼 Earnings</option>
              <option value="Corporate">🏢 Corporate</option>
              <option value="Global">🌍 Global</option>
            </select>
          </div>

          {/* Desktop: Filter row */}
          <div className="sai-filters-desktop" style={s.filterRow}>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                style={{
                  ...s.filterBtn,
                  background: selectedEventType === type ? '#0D5C6E' : '#fff',
                  color: selectedEventType === type ? '#fff' : '#333',
                  fontWeight: selectedEventType === type ? 700 : 500,
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <div style={s.viewControls}>
            <span style={s.viewLabel}>View:</span>
            {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  ...s.viewBtn,
                  background: view === v ? '#0D5C6E' : '#fff',
                  color: view === v ? '#fff' : '#333',
                  fontWeight: view === v ? 700 : 500,
                }}
              >
                {v}
              </button>
            ))}
            <span style={s.untilText}>Until 31 Mar 2027</span>
          </div>

          {view === 'Monthly' && (
            <div style={s.calendarBox}>
              <div style={s.monthNav}>
                <button onClick={prevMonth} style={s.navBtn}>←</button>
                <h2 style={s.monthName}>{monthName}</h2>
                <button onClick={nextMonth} style={s.navBtn}>→</button>
              </div>

              <div style={s.calendarNavRow}>
                <button onClick={() => setShowPastDates(false)} style={{ ...s.calendarNavBtn, ...(showPastDates ? s.calendarNavBtnInactive : s.calendarNavBtnActive) }}>
                  ← Hide Past
                </button>
                <button onClick={() => setShowPastDates(true)} style={{ ...s.calendarNavBtn, ...(showPastDates ? s.calendarNavBtnActive : s.calendarNavBtnInactive) }}>
                  Show Full ⊕
                </button>
              </div>

              <div style={s.dayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} style={s.dayHeader}>{d}</div>
                ))}
              </div>

              <div style={s.calendarGrid}>
                {visibleWeeks.map((week, weekIdx) => (
                  <div key={weekIdx} style={s.weekRow}>
                    {week.map((day, dayIdx) => {
                      const isPastDate = isCurrentMonth && day && day < today.getDate();
                      const eventColor = day ? getEventColor(day) : null;
                      
                      return (
                        <div
                          key={dayIdx}
                          style={{
                            ...s.calendarDay,
                            ...(day ? { background: '#fff', border: eventColor ? `1.5px solid ${eventColor}` : '0.5px solid #e0e0e0' } : {}),
                            ...(eventColor ? { background: `${eventColor}14` } : {}),
                            ...(isPastDate ? { opacity: 0.4 } : {}),
                          }}
                        >
                          {day && (
                            <>
                              <span style={s.dayNumber}>{day}</span>
                              {eventColor && <span style={{ ...s.eventDot, background: eventColor }} />}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'Yearly' && (
            <div style={s.calendarBox}>
              {yearlyMonth !== null ? (
                <div>
                  <button onClick={() => setYearlyMonth(null)} style={s.backBtn}>← Back to yearly</button>
                  <h2 style={s.fullMonthTitle}>{new Date(year, yearlyMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                </div>
              ) : (
                <div style={s.yearlyGrid}>
                  {Array.from({ length: 12 }).map((_, m) => {
                    const monthDate = new Date(year, m);
                    const firstDayOfMonth = new Date(year, m, 1).getDay();
                    const daysOfMonth = new Date(year, m + 1, 0).getDate();
                    const monthEventsData = filteredEvents.filter((e) => e.date.getMonth() === m && e.date.getFullYear() === year);

                    return (
                      <div
                        key={m}
                        style={{ ...s.miniCalendar, ...(hoveredMiniMonth === m ? s.miniCalendarHover : {}) }}
                        onMouseEnter={() => setHoveredMiniMonth(m)}
                        onMouseLeave={() => setHoveredMiniMonth(null)}
                        onClick={() => setYearlyMonth(m)}
                      >
                        <div style={s.miniMonthName}>{monthDate.toLocaleDateString('en-US', { month: 'short' })} {year}</div>
                        <div style={s.miniDayHeaders}>
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                            <div key={d} style={s.miniDayHeader}>{d}</div>
                          ))}
                        </div>
                        <div style={s.miniCalendarGrid}>
                          {Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`empty-${i}`} />))}
                          {Array.from({ length: daysOfMonth }).map((_, i) => {
                            const day = i + 1;
                            const dayHasEvent = monthEventsData.some((e) => e.date.getDate() === day);
                            const eventColor = dayHasEvent ? monthEventsData.find((e) => e.date.getDate() === day)?.color : null;

                            return (
                              <div key={day} style={{ ...s.miniDay, ...(eventColor ? { background: `${eventColor}20`, border: `0.5px solid ${eventColor}` } : {}) }}>
                                {day}
                                {eventColor && <div style={{ ...s.miniEventDot, background: eventColor }} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {selectedEvent && (
        <div style={s.eventPopup}>
          <div style={s.eventPopupContent}>
            <button onClick={() => setSelectedEvent(null)} style={s.closeBtn}>✕</button>
            <h3 style={s.eventPopupTitle}>{selectedEvent.title}</h3>
            <p style={s.eventPopupMeta}>{selectedEvent.date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p style={{ ...s.eventPopupImpact, color: selectedEvent.color }}>{selectedEvent.impact} Impact</p>
            <p style={s.eventPopupDesc}>{selectedEvent.description}</p>
          </div>
        </div>
      )}

      <footer style={s.footer}>
        <span>© {new Date().getFullYear()} <span style={{ fontWeight: 700 }}>setup<span style={{ color: '#00C896' }}>ai</span></span> · setupai.in</span>
        <div style={s.footerLinks}>
          <Link href="/" style={s.footerLink}>Home</Link>
          <Link href="/about" style={s.footerLink}>About</Link>
          <Link href="/tools" style={s.footerLink}>Tools</Link>
          <Link href="/events" style={s.footerLink}>Events</Link>
        </div>
        <p style={s.disclaimer}>Financial news and information for educational purposes only. Nothing here is investment advice.</p>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .burger-menu { display: block !important; }
          .sai-upcoming-mobile { display: block !important; }
          .sai-filters-mobile { display: flex !important; }
          .sai-filters-desktop { display: none !important; }
        }
        @media (min-width: 861px) {
          .sai-upcoming-mobile { display: none !important; }
          .sai-filters-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const s = {
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh' },
  nav: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 18, fontWeight: 700, color: '#fff', textDecoration: 'none' },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { fontSize: 13, color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  burger: { display: 'none', background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' },
  menuOverlay: { position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.45)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' },
  menuPanel: { width: '78%', maxWidth: 320, height: '100%', background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF6EF 100%)', boxShadow: '-10px 0 30px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  menuHeader: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  menuClose: { background: 'transparent', border: 'none', color: '#9FE1CB', fontSize: 18, cursor: 'pointer' },
  menuTagline: { fontSize: 11, color: '#0D5C6E', margin: '14px 18px 4px', fontWeight: 500 },
  menuLinks: { padding: '8px 12px 20px', display: 'flex', flexDirection: 'column', gap: 7 },
  menuLink: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', borderRadius: 11, background: '#fff', border: '1px solid #ECE4D6', fontSize: 14, color: '#1A2B2E', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, cursor: 'pointer' },
  container: { display: 'flex', gap: 20, margin: '20px', maxWidth: 1400 },
  main: { flex: 1 },
  pageTitle: { margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#333' },
  upcomingMobileSection: { display: 'none', marginBottom: 16 },
  upcomingBtn: { width: '100%', background: '#fff', border: '1px solid #E4DCCE', padding: '11px 12px', borderRadius: 8, textAlign: 'left', fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  upcomingList: { background: '#fff', border: '1px solid #E4DCCE', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 8, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  upcomingEvent: { padding: 8, background: '#FAECE7', borderRadius: 6, borderLeft: '3px solid #D85A30' },
  upcomingTitle: { margin: 0, fontSize: 12, fontWeight: 600, color: '#333' },
  upcomingTime: { margin: '4px 0 0', fontSize: 10, color: '#666' },
  filterRowMobile: { display: 'none', gap: 8, marginBottom: 16 },
  filterSelectMobile: { flex: 1, padding: '8px 10px', fontSize: 12, border: '1px solid #E4DCCE', borderRadius: 6, background: '#fff', fontFamily: FONT, cursor: 'pointer', fontWeight: 500 },
  filterRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '8px 14px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 8, cursor: 'pointer', fontFamily: FONT, fontWeight: 500 },
  viewControls: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  viewLabel: { fontSize: 12, color: '#666', fontWeight: 600 },
  viewBtn: { padding: '6px 12px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer', fontFamily: FONT },
  untilText: { fontSize: 11, color: '#999', marginLeft: 'auto' },
  calendarBox: { background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: 16 },
  monthNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 12 },
  navBtn: { background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#0D5C6E', fontWeight: 700 },
  monthName: { margin: 0, fontSize: 18, fontWeight: 700, color: '#333', flex: 1, textAlign: 'center' },
  calendarNavRow: { display: 'flex', gap: 8, marginBottom: 14 },
  calendarNavBtn: { flex: 1, padding: '10px 14px', fontSize: 12, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: FONT, fontWeight: 700, transition: 'all 0.2s ease' },
  calendarNavBtnActive: { background: '#0D5C6E', color: '#fff' },
  calendarNavBtnInactive: { background: '#E0E0E0', color: '#999' },
  dayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 10, textAlign: 'center' },
  dayHeader: { fontSize: 11, fontWeight: 700, color: '#666' },
  calendarGrid: { display: 'flex', flexDirection: 'column', gap: 6 },
  weekRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 },
  calendarDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 6, position: 'relative', minHeight: 50, fontSize: 13, fontWeight: 600 },
  dayNumber: { fontSize: 12, fontWeight: 600, color: '#333' },
  eventDot: { width: 6, height: 6, borderRadius: '50%', marginTop: 3 },
  yearlyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 },
  miniCalendar: { background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, padding: 10, cursor: 'pointer', transition: 'all 0.2s ease' },
  miniCalendarHover: { transform: 'scale(1.05)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', borderColor: '#0D5C6E' },
  miniMonthName: { width: '100%', margin: 0, padding: '6px', fontSize: 12, fontWeight: 700, color: '#0D5C6E', textAlign: 'center', marginBottom: 6 },
  miniDayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 5 },
  miniDayHeader: { fontSize: 9, fontWeight: 600, color: '#666', textAlign: 'center' },
  miniCalendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 },
  miniDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500, color: '#333', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 3, position: 'relative' },
  miniEventDot: { width: 3, height: 3, borderRadius: '50%', marginTop: 1 },
  backBtn: { padding: '8px 12px', fontSize: 12, background: '#0D5C6E', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: FONT, marginBottom: 16 },
  fullMonthTitle: { margin: '0 0 16px', fontSize: 22, fontWeight: 700, color: '#333', textAlign: 'center' },
  eventPopup: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  eventPopupContent: { background: '#fff', borderRadius: 12, padding: 24, maxWidth: 400, position: 'relative' },
  closeBtn: { position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#666' },
  eventPopupTitle: { margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#333' },
  eventPopupMeta: { margin: '0 0 8px', fontSize: 13, color: '#666' },
  eventPopupImpact: { margin: '0 0 12px', fontSize: 12, fontWeight: 600 },
  eventPopupDesc: { margin: 0, fontSize: 13, color: '#666', lineHeight: 1.5 },
  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 12, marginTop: 40 },
  footerLinks: { display: 'flex', gap: 16 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 500, margin: 0 },
};