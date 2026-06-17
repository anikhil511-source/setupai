import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";

// Static event data
const EVENTS_DATA = [
  {
    id: 1,
    title: 'RBI Policy Decision',
    date: new Date(2026, 5, 24, 14, 30),
    impact: 'High',
    type: 'RBI Meetings',
    description: 'The Reserve Bank of India announces its monetary policy decision.',
    color: '#D85A30',
  },
  {
    id: 2,
    title: 'TCS Q1 FY27 Earnings',
    date: new Date(2026, 5, 25, 16, 0),
    impact: 'Medium',
    type: 'Earnings',
    description: 'Tata Consultancy Services reports Q1 earnings.',
    color: '#BA7517',
  },
  {
    id: 3,
    title: 'US Fed Interest Rate Decision',
    date: new Date(2026, 5, 26, 18, 30),
    impact: 'High',
    type: 'Global',
    description: 'Federal Reserve announces its latest policy decision.',
    color: '#00A37A',
  },
  {
    id: 4,
    title: 'Infosys Q1 FY27 Results',
    date: new Date(2026, 5, 27, 10, 0),
    impact: 'Medium',
    type: 'Earnings',
    description: 'Infosys reports Q1 results with FY27 guidance.',
    color: '#BA7517',
  },
  {
    id: 5,
    title: 'HDFC Bank AGM',
    date: new Date(2026, 5, 28, 15, 0),
    impact: 'Low',
    type: 'Corporate',
    description: 'Annual General Meeting of shareholders.',
    color: '#999',
  },
  {
    id: 6,
    title: 'ITC Q1 FY27 Earnings',
    date: new Date(2026, 5, 30, 14, 30),
    impact: 'Medium',
    type: 'Earnings',
    description: 'ITC reports Q1 earnings.',
    color: '#BA7517',
  },
  {
    id: 7,
    title: 'SEBI Board Meeting',
    date: new Date(2026, 6, 5, 10, 0),
    impact: 'High',
    type: 'RBI Meetings',
    description: 'Securities and Exchange Board of India board meeting.',
    color: '#D85A30',
  },
  {
    id: 8,
    title: 'Reliance Q1 Earnings',
    date: new Date(2026, 6, 10, 14, 0),
    impact: 'High',
    type: 'Earnings',
    description: 'Reliance Industries reports Q1 earnings.',
    color: '#BA7517',
  },
];

export default function Events() {
  const [selectedEventType, setSelectedEventType] = useState('All Events');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5));
  const [view, setView] = useState('Monthly');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPastDates, setShowPastDates] = useState(false);
  const [eventPage, setEventPage] = useState(0);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Request notification permission on mount
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

  // Schedule notifications 15 mins before each event
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

  // Filter events by type
  const filteredEvents = selectedEventType === 'All Events'
    ? EVENTS_DATA
    : EVENTS_DATA.filter((e) => e.type === selectedEventType);

  // Get next 6-7 events for the timeline
  const EVENTS_PER_PAGE = 6;
  const nextEvents = filteredEvents
    .sort((a, b) => a.date - b.date)
    .slice(eventPage * EVENTS_PER_PAGE, (eventPage + 1) * EVENTS_PER_PAGE);

  const totalEventPages = Math.ceil(filteredEvents.sort((a, b) => a.date - b.date).length / EVENTS_PER_PAGE);

  const eventTypes = ['All Events', 'RBI Meetings', 'Earnings', 'Corporate', 'Global'];

  // Calendar logic for current month (hide past dates)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isPastDate = isCurrentMonth && day < today.getDate();
    calendarDays.push(isPastDate && !showPastDates ? { day, hidden: true } : day);
  }

  // Get events for the current month
  const monthEvents = filteredEvents.filter((e) => {
    return e.date.getFullYear() === year && e.date.getMonth() === month;
  });

  const hasEvents = (day) => monthEvents.some((e) => e.date.getDate() === day);
  const getEventColor = (day) => {
    const dayEvents = monthEvents.filter((e) => e.date.getDate() === day);
    return dayEvents.length > 0 ? dayEvents[0].color : null;
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const monthShort = currentDate.toLocaleDateString('en-US', { month: 'short' });

  // Yearly view - all 12 months
  const renderYearlyCalendar = () => {
    const months = [];
    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(year, m);
      const firstDayOfMonth = new Date(year, m, 1).getDay();
      const daysOfMonth = new Date(year, m + 1, 0).getDate();
      const monthEvents = filteredEvents.filter((e) => e.date.getMonth() === m && e.date.getFullYear() === year);

      months.push({
        month: m,
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        firstDay: firstDayOfMonth,
        days: daysOfMonth,
        events: monthEvents,
      });
    }

    return (
      <div style={s.yearlyGrid}>
        {months.map((m) => (
          <div key={m.month} style={s.miniCalendar}>
            <h3 style={s.miniMonthName}>{m.name} {year}</h3>
            <div style={s.miniDayHeaders}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                <div key={d} style={s.miniDayHeader}>{d}</div>
              ))}
            </div>
            <div style={s.miniCalendarGrid}>
              {Array.from({ length: m.firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: m.days }).map((_, i) => {
                const day = i + 1;
                const dayHasEvent = m.events.some((e) => e.date.getDate() === day);
                const eventColor = dayHasEvent ? m.events.find((e) => e.date.getDate() === day)?.color : null;
                return (
                  <div
                    key={day}
                    style={{
                      ...s.miniDay,
                      ...(eventColor ? { background: `${eventColor}20`, border: `1px solid ${eventColor}` } : {}),
                    }}
                  >
                    {day}
                    {eventColor && <div style={{ ...s.miniEventDot, background: eventColor }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={s.page}>
      <Head>
        <title>Market Events Calendar — SetupAI</title>
        <meta name="description" content="Upcoming market events, earnings, and RBI meetings that impact Indian stocks." />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div className="desktop-nav" style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={s.navLink}>About</Link>
          <Link href="/tools" style={s.navLink}>Tools</Link>
          <Link href="/events" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>Events</Link>
        </div>
        <button className="burger-menu" onClick={() => setMenuOpen(!menuOpen)} style={s.burger} aria-label="Menu">☰</button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={s.mobileMenu}>
          <Link href="/" style={s.mobileLink}>Home</Link>
          <Link href="/about" style={s.mobileLink}>About</Link>
          <Link href="/tools" style={s.mobileLink}>Tools</Link>
          <Link href="/events" style={{ ...s.mobileLink, background: '#00A37A', color: '#fff' }}>Events Calendar</Link>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div style={s.container}>
        {/* LEFT SIDEBAR — Events Timeline */}
        <aside style={s.sidebar}>
          <h3 style={s.sidebarTitle}>Events</h3>
          <div style={s.timeline}>
            {nextEvents.length === 0 ? (
              <p style={s.emptyText}>No events in this filter.</p>
            ) : (
              nextEvents.map((event) => (
                <div key={event.id} style={s.timelineEvent}>
                  <div style={{ ...s.timelineDot, background: event.color }} />
                  <div>
                    <p style={s.eventName}>{event.title}</p>
                    <p style={s.eventDate}>
                      {event.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p style={{ ...s.eventImpact, color: event.color }}>{event.impact} Impact</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Previous/Next for events */}
          {totalEventPages > 1 && (
            <div style={s.eventPagination}>
              <button
                onClick={() => setEventPage(Math.max(0, eventPage - 1))}
                disabled={eventPage === 0}
                style={{ ...s.paginationBtn, opacity: eventPage === 0 ? 0.5 : 1, cursor: eventPage === 0 ? 'default' : 'pointer' }}
              >
                ← Previous
              </button>
              <span style={s.pageInfo}>{eventPage + 1} of {totalEventPages}</span>
              <button
                onClick={() => setEventPage(Math.min(totalEventPages - 1, eventPage + 1))}
                disabled={eventPage >= totalEventPages - 1}
                style={{ ...s.paginationBtn, opacity: eventPage >= totalEventPages - 1 ? 0.5 : 1, cursor: eventPage >= totalEventPages - 1 ? 'default' : 'pointer' }}
              >
                Next →
              </button>
            </div>
          )}

          {/* Notification toggle */}
          <label style={s.notificationToggle}>
            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={(e) => {
                setNotificationEnabled(e.target.checked);
                if (e.target.checked) scheduleNotifications();
              }}
            />
            <span>🔔 Get 15-min alerts</span>
          </label>
        </aside>

        {/* CENTER/RIGHT — Calendar */}
        <main style={s.main}>
          <h1 style={s.pageTitle}>Market Events Calendar</h1>

          {/* Event Type Filters */}
          <div style={s.filterRow}>
            {eventTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedEventType(type);
                  setEventPage(0);  // Reset to first page when filter changes
                }}
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

          {/* View Controls */}
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

          {/* YEARLY VIEW */}
          {view === 'Yearly' && (
            <div style={s.calendarBox}>
              {renderYearlyCalendar()}
            </div>
          )}

          {/* MONTHLY VIEW (and other views for now) */}
          {view !== 'Yearly' && (
            <div style={s.calendarBox}>
              <div style={s.monthNav}>
                <button onClick={prevMonth} style={s.navBtn}>←</button>
                <h2 style={s.monthName}>{monthName}</h2>
                <button onClick={nextMonth} style={s.navBtn}>→</button>
              </div>

              {/* Collapsible Past Dates Section */}
              {isCurrentMonth && showPastDates && (
                <button
                  onClick={() => setShowPastDates(false)}
                  style={s.togglePastBtn}
                >
                  ▲ Hide past dates
                </button>
              )}
              {isCurrentMonth && !showPastDates && (
                <button
                  onClick={() => setShowPastDates(true)}
                  style={s.togglePastBtn}
                >
                  ▼ View past events of {monthShort}
                </button>
              )}

              {/* Day headers */}
              <div style={s.dayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} style={s.dayHeader}>{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={s.calendarGrid}>
                {calendarDays.map((day, idx) => {
                  const isHidden = day && day.hidden;
                  const displayDay = isHidden ? null : day;
                  const eventColor = displayDay ? getEventColor(displayDay) : null;
                  return (
                    <div
                      key={idx}
                      style={{
                        ...s.calendarDay,
                        ...(displayDay ? { background: '#fff', border: eventColor ? `2px solid ${eventColor}` : '0.5px solid #e0e0e0' } : {}),
                        ...(eventColor ? { background: `${eventColor}14` } : {}),
                      }}
                    >
                      {displayDay && (
                        <>
                          <span style={s.dayNumber}>{displayDay}</span>
                          {eventColor && <span style={{ ...s.eventDot, background: eventColor }} />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

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
          Financial news and information for educational purposes only. Nothing here is investment advice.
        </p>
      </footer>

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .burger-menu { display: block !important; }
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

  mobileMenu: { background: '#fff', border: '1px solid #e0e0e0', padding: '12px', display: 'flex', flexDirection: 'column', gap: 8, position: 'absolute', top: 60, right: 0, zIndex: 100, minWidth: 180 },
  mobileLink: { padding: '10px', fontSize: 13, textDecoration: 'none', color: '#333', borderRadius: 6, display: 'block', textAlign: 'center' },

  container: { display: 'flex', gap: 20, margin: '20px', maxWidth: 1400 },

  sidebar: { width: 260, background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: 20, height: 'fit-content' },
  sidebarTitle: { margin: '0 0 16px', fontSize: 13, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: 1 },

  timeline: { display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', marginBottom: 16 },
  timelineEvent: { display: 'flex', gap: 12, paddingLeft: 12, position: 'relative' },
  timelineDot: { width: 18, height: 18, borderRadius: '50%', border: '2px solid #fff', position: 'absolute', left: -15, top: 2 },
  eventName: { margin: 0, fontSize: 12, fontWeight: 600, color: '#333' },
  eventDate: { margin: '2px 0', fontSize: 11, color: '#666' },
  eventImpact: { margin: 0, fontSize: 10, fontWeight: 500 },
  emptyText: { fontSize: 12, color: '#999' },

  eventPagination: { display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 12, borderTop: '1px solid #e0e0e0' },
  paginationBtn: { padding: '6px 10px', fontSize: 11, border: '0.5px solid #ccc', borderRadius: 6, background: 'white', cursor: 'pointer', fontFamily: FONT, fontWeight: 500 },
  pageInfo: { fontSize: 11, textAlign: 'center', color: '#666' },

  notificationToggle: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px', background: '#f5f5f5', borderRadius: 6, cursor: 'pointer', fontSize: 12 },

  main: { flex: 1 },
  pageTitle: { margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#333' },

  filterRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '8px 14px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 8, cursor: 'pointer', fontFamily: FONT, fontWeight: 500 },

  viewControls: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' },
  viewLabel: { fontSize: 12, color: '#666', fontWeight: 600 },
  viewBtn: { padding: '6px 12px', fontSize: 12, border: '0.5px solid #ccc', borderRadius: 6, cursor: 'pointer', fontFamily: FONT },
  untilText: { fontSize: 11, color: '#999', marginLeft: 'auto' },

  calendarBox: { background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 12, padding: 20 },
  monthNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  navBtn: { background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#0D5C6E', fontWeight: 700 },
  monthName: { margin: 0, fontSize: 20, fontWeight: 700, color: '#333' },

  togglePastBtn: { width: '100%', padding: '10px', fontSize: 12, border: '0.5px dashed #ccc', background: '#f9f9f9', borderRadius: 6, cursor: 'pointer', fontFamily: FONT, marginBottom: 16, color: '#0D5C6E', fontWeight: 600 },

  dayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 12, textAlign: 'center' },
  dayHeader: { fontSize: 12, fontWeight: 700, color: '#666' },

  calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 },
  calendarDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'relative', minHeight: 60 },
  dayNumber: { fontSize: 13, fontWeight: 600, color: '#333' },
  eventDot: { width: 8, height: 8, borderRadius: '50%', marginTop: 4 },

  // Yearly view styles
  yearlyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  miniCalendar: { background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 },
  miniMonthName: { margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#333', textAlign: 'center' },
  miniDayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 },
  miniDayHeader: { fontSize: 10, fontWeight: 600, color: '#666', textAlign: 'center' },
  miniCalendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 },
  miniDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, color: '#333', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 4, position: 'relative' },
  miniEventDot: { width: 4, height: 4, borderRadius: '50%', marginTop: 2 },

  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 12, marginTop: 40 },
  footerLinks: { display: 'flex', gap: 16 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 500, margin: 0 },
};