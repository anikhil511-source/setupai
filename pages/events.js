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
  const [eventPage, setEventPage] = useState(0);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [yearlyMonth, setYearlyMonth] = useState(null);
  const [showPastDates, setShowPastDates] = useState(false);

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

  // Calendar logic for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build weeks array
  const weeks = [];
  let currentWeek = [];
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  // Filter weeks: hide if all dates are past, show if row contains today or future
  const visibleWeeks = showPastDates ? weeks : weeks.filter((week) => {
    const hasCurrentOrFuture = week.some((day) => {
      if (!day) return false;
      const date = new Date(year, month, day);
      return date >= new Date(year, month, today.getDate());
    });
    return hasCurrentOrFuture;
  });

  // Get events for the current month
  const monthEvents = filteredEvents.filter((e) => {
    return e.date.getFullYear() === year && e.date.getMonth() === month;
  });

  const hasEvents = (day) => monthEvents.some((e) => e.date.getDate() === day);
  const getEventColor = (day) => {
    const dayEvents = monthEvents.filter((e) => e.date.getDate() === day);
    return dayEvents.length > 0 ? dayEvents[0].color : null;
  };

  const getEventsByDate = (day) => {
    return monthEvents.filter((e) => e.date.getDate() === day);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Weekly view data
  const getWeekDays = () => {
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(curr.setDate(first + i));
      weekDays.push(new Date(d));
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const weekEvents = filteredEvents.filter((e) => {
    return weekDays.some((d) => 
      d.toDateString() === e.date.toDateString()
    );
  });

  // Daily view data
  const dailyEvents = filteredEvents.filter((e) => {
    return e.date.toDateString() === currentDate.toDateString();
  });

  // Yearly view - all 12 months with click interactions
  const renderYearlyCalendar = () => {
    if (yearlyMonth !== null) {
      // Full month view from yearly
      const monthDate = new Date(year, yearlyMonth);
      const firstDayOfMonth = new Date(year, yearlyMonth, 1).getDay();
      const daysOfMonth = new Date(year, yearlyMonth + 1, 0).getDate();
      const monthEventsData = filteredEvents.filter((e) => e.date.getMonth() === yearlyMonth && e.date.getFullYear() === year);

      return (
        <div style={s.fullMonthView}>
          <button onClick={() => setYearlyMonth(null)} style={s.backBtn}>← Back to yearly view</button>
          <h2 style={s.fullMonthTitle}>{monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>

          <div style={s.dayHeadersLarge}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={s.dayHeaderLarge}>{d}</div>
            ))}
          </div>

          <div style={s.calendarGridLarge}>
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysOfMonth }).map((_, i) => {
              const day = i + 1;
              const dayHasEvent = monthEventsData.some((e) => e.date.getDate() === day);
              const eventColor = dayHasEvent ? monthEventsData.find((e) => e.date.getDate() === day)?.color : null;
              const dayEvents = monthEventsData.filter((e) => e.date.getDate() === day);

              return (
                <div
                  key={day}
                  style={{
                    ...s.calendarDayLarge,
                    ...(eventColor ? { background: `${eventColor}20`, border: `1.5px solid ${eventColor}` } : {}),
                  }}
                  onMouseEnter={() => setHoveredDate(`${year}-${yearlyMonth}-${day}`)}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  {day}
                  {eventColor && <div style={{ ...s.eventDotLarge, background: eventColor }} />}

                  {/* Hover preview */}
                  {hoveredDate === `${year}-${yearlyMonth}-${day}` && dayEvents.length > 0 && (
                    <div style={s.hoverPreview}>
                      {dayEvents.map((evt) => (
                        <div key={evt.id} style={{ fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Yearly grid view
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
            <button
              onClick={() => setYearlyMonth(m.month)}
              style={s.miniMonthName}
            >
              {m.name} {year}
            </button>
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
                const dayEvents = m.events.filter((e) => e.date.getDate() === day);

                return (
                  <div
                    key={day}
                    style={{
                      ...s.miniDay,
                      ...(eventColor ? { background: `${eventColor}20`, border: `0.5px solid ${eventColor}` } : {}),
                      cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (dayEvents.length > 0) {
                        setSelectedEvent(dayEvents[0]);
                      }
                    }}
                    onMouseEnter={() => {
                      if (dayEvents.length > 0) setHoveredDate(`${year}-${m.month}-${day}`);
                    }}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    {day}
                    {eventColor && <div style={{ ...s.miniEventDot, background: eventColor }} />}

                    {/* Hover preview */}
                    {hoveredDate === `${year}-${m.month}-${day}` && dayEvents.length > 0 && (
                      <div style={s.miniHoverPreview}>
                        {dayEvents[0].title.substring(0, 15)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Weekly view render (Teams style)
  const renderWeeklyView = () => {
    const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

    return (
      <div style={s.weeklyContainer}>
        <div style={s.weeklyHeader}>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))} style={s.weekNavBtn}>←</button>
          <span style={s.weekDateRange}>
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))} style={s.weekNavBtn}>→</button>
        </div>

        <div style={s.weeklyGrid}>
          {/* Time column */}
          <div style={s.timeColumn}>
            <div style={s.timeHeader}></div>
            {hours.map((hour) => (
              <div key={hour} style={s.timeSlot}>
                {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day, dayIdx) => (
            <div key={dayIdx} style={s.dayColumn}>
              <div style={s.dayHeader}>
                <span style={s.dayOfWeek}>{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span style={s.dayDate}>{day.getDate()}</span>
              </div>
              <div style={s.hourGridContainer}>
                {hours.map((hour) => {
                  const dayEventInHour = weekEvents.filter((e) => {
                    return e.date.toDateString() === day.toDateString() && e.date.getHours() === hour;
                  });

                  return (
                    <div key={hour} style={s.hourCell}>
                      {dayEventInHour.map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => setSelectedEvent(evt)}
                          style={{
                            ...s.eventBlock,
                            background: evt.color,
                            cursor: 'pointer',
                          }}
                        >
                          <p style={s.eventBlockTitle}>{evt.title}</p>
                          <p style={s.eventBlockTime}>{evt.date.getHours()}:{String(evt.date.getMinutes()).padStart(2, '0')}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Daily view render (Teams style)
  const renderDailyView = () => {
    const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

    return (
      <div style={s.dailyContainer}>
        <div style={s.dailyHeader}>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))} style={s.dayNavBtn}>←</button>
          <h2 style={s.dailyDateTitle}>
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))} style={s.dayNavBtn}>→</button>
        </div>

        <div style={s.dailyGrid}>
          <div style={s.timeColumnDaily}>
            {hours.map((hour) => (
              <div key={hour} style={s.timeSlotDaily}>
                {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
              </div>
            ))}
          </div>

          <div style={s.dayEventsContainer}>
            {hours.map((hour) => {
              const eventInHour = dailyEvents.filter((e) => e.date.getHours() === hour);

              return (
                <div key={hour} style={s.hourCellDaily}>
                  {eventInHour.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      style={{
                        ...s.eventBlockDaily,
                        background: evt.color,
                        cursor: 'pointer',
                      }}
                    >
                      <p style={s.eventBlockTitleDaily}>{evt.title}</p>
                      <p style={s.eventBlockTimeDaily}>{evt.date.getHours()}:{String(evt.date.getMinutes()).padStart(2, '0')}</p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
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
              <div style={{ position: 'relative' }}>
                {/* Vertical timeline line */}
                <div style={s.timelineVerticalLine} />
                
                {nextEvents.map((event, idx) => (
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
                ))}
              </div>
            )}
          </div>

          {/* Previous/Next for events - Card style */}
          {totalEventPages > 1 && (
            <div style={s.eventPaginationCard}>
              <button
                onClick={() => setEventPage(Math.max(0, eventPage - 1))}
                disabled={eventPage === 0}
                style={{ 
                  ...s.paginationCardBtn, 
                  ...(eventPage === 0 ? s.paginationCardBtnDisabled : s.paginationCardBtnPrev)
                }}
              >
                ← Previous
              </button>
              <button
                onClick={() => setEventPage(Math.min(totalEventPages - 1, eventPage + 1))}
                disabled={eventPage >= totalEventPages - 1}
                style={{ 
                  ...s.paginationCardBtn, 
                  ...(eventPage >= totalEventPages - 1 ? s.paginationCardBtnDisabled : s.paginationCardBtnNext)
                }}
              >
                Next →
              </button>
            </div>
          )}

          <div style={s.pageInfo}>{eventPage + 1} of {totalEventPages}</div>

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
                  setEventPage(0);
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

          {/* DAILY VIEW */}
          {view === 'Daily' && (
            <div style={s.calendarBox}>
              {renderDailyView()}
            </div>
          )}

          {/* WEEKLY VIEW */}
          {view === 'Weekly' && (
            <div style={s.calendarBox}>
              {renderWeeklyView()}
            </div>
          )}

          {/* YEARLY VIEW */}
          {view === 'Yearly' && (
            <div style={s.calendarBox}>
              {renderYearlyCalendar()}
            </div>
          )}

          {/* MONTHLY VIEW */}
          {view === 'Monthly' && (
            <div style={s.calendarBox}>
              <div style={s.monthNav}>
                <button onClick={prevMonth} style={s.navBtn}>←</button>
                <h2 style={s.monthName}>{monthName}</h2>
                <button onClick={nextMonth} style={s.navBtn}>→</button>
                <button 
                  onClick={() => setShowPastDates(!showPastDates)}
                  style={s.toggleIcon} 
                  title="View full month"
                >
                  ⊕
                </button>
              </div>

              {/* Day headers with toggle icon on right of Sat */}
              <div style={s.dayHeaders}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
                  <div key={d} style={s.dayHeader}>{d}</div>
                ))}
                <div style={s.satHeaderWithIcon}>
                  <span style={s.satText}>Sat</span>
                </div>
              </div>

              {/* Calendar grid - only visible weeks */}
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
        </main>
      </div>

      {/* Event detail popup */}
      {selectedEvent && (
        <div style={s.eventPopup}>
          <div style={s.eventPopupContent}>
            <button onClick={() => setSelectedEvent(null)} style={s.closeBtn}>✕</button>
            <h3 style={s.eventPopupTitle}>{selectedEvent.title}</h3>
            <p style={s.eventPopupMeta}>
              {selectedEvent.date.toLocaleDateString('en-IN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
            <p style={{ ...s.eventPopupImpact, color: selectedEvent.color }}>{selectedEvent.impact} Impact</p>
            <p style={s.eventPopupDesc}>{selectedEvent.description}</p>
          </div>
        </div>
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

  timeline: { display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', marginBottom: 16 },
  timelineVerticalLine: { position: 'absolute', left: '8px', top: '18px', bottom: '0', width: '2px', background: '#BFD9D3' },
  timelineEvent: { display: 'flex', gap: 12, paddingLeft: 12, position: 'relative', marginBottom: 16 },
  timelineDot: { width: 18, height: 18, borderRadius: '50%', border: '3px solid #fff', position: 'absolute', left: -8, top: 2, zIndex: 1 },
  eventName: { margin: 0, fontSize: 12, fontWeight: 600, color: '#333' },
  eventDate: { margin: '2px 0', fontSize: 11, color: '#666' },
  eventImpact: { margin: 0, fontSize: 10, fontWeight: 500 },
  emptyText: { fontSize: 12, color: '#999' },

  eventPaginationCard: { display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 12, borderTop: '1px solid #e0e0e0' },
  paginationCardBtn: { padding: '12px 16px', fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: FONT, fontWeight: 700, transition: 'all 0.2s ease' },
  paginationCardBtnNext: { background: '#0D5C6E', color: '#fff' },
  paginationCardBtnPrev: { background: '#E0E0E0', color: '#666' },
  paginationCardBtnDisabled: { background: '#E0E0E0', color: '#999', cursor: 'default', opacity: 0.6 },
  pageInfo: { fontSize: 11, textAlign: 'center', color: '#666', marginTop: 8, fontWeight: 500 },

  notificationToggle: { display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, padding: '10px', background: '#f5f5f5', borderRadius: 6, cursor: 'pointer', fontSize: 12 },

  main: { flex: 1 },
  pageTitle: { margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#333' },

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
  toggleIcon: { background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: '#0D5C6E', fontWeight: 700, padding: 0 },

  dayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 10, textAlign: 'center' },
  dayHeader: { fontSize: 11, fontWeight: 700, color: '#666' },
  satHeaderWithIcon: { fontSize: 11, fontWeight: 700, color: '#666' },
  satText: { flex: 1 },

  calendarGrid: { display: 'flex', flexDirection: 'column', gap: 6 },
  weekRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 },
  calendarDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 6, position: 'relative', minHeight: 50, fontSize: 13, fontWeight: 600 },
  dayNumber: { fontSize: 12, fontWeight: 600, color: '#333' },
  eventDot: { width: 6, height: 6, borderRadius: '50%', marginTop: 3 },

  // Weekly view styles
  weeklyContainer: { padding: '16px' },
  weeklyHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  weekDateRange: { fontSize: 16, fontWeight: 700, color: '#333' },
  weekNavBtn: { background: '#0D5C6E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: FONT },
  weeklyGrid: { display: 'grid', gridTemplateColumns: '80px 1fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: 8, background: '#fff' },
  timeColumn: { paddingTop: '40px' },
  timeSlot: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, fontSize: 11, color: '#666', fontWeight: 500, borderRight: '1px solid #e0e0e0' },
  timeHeader: { height: '40px', paddingRight: 8 },
  dayColumn: { borderLeft: '1px solid #e0e0e0' },
  dayHeader: { height: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e0e0e0', background: '#f9f9f9' },
  dayOfWeek: { fontSize: 11, fontWeight: 600, color: '#666' },
  dayDate: { fontSize: 16, fontWeight: 700, color: '#333' },
  hourGridContainer: { position: 'relative' },
  hourCell: { height: '60px', borderBottom: '1px solid #e0e0e0', position: 'relative', padding: 4 },
  eventBlock: { padding: '4px 6px', borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' },
  eventBlockTitle: { margin: '0 0 2px', fontSize: 10, fontWeight: 600 },
  eventBlockTime: { margin: 0, fontSize: 9 },

  // Daily view styles
  dailyContainer: { padding: '16px' },
  dailyHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 },
  dailyDateTitle: { margin: 0, fontSize: 20, fontWeight: 700, color: '#333', flex: 1, textAlign: 'center' },
  dayNavBtn: { background: '#0D5C6E', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: FONT },
  dailyGrid: { display: 'grid', gridTemplateColumns: '80px 1fr', gap: 8 },
  timeColumnDaily: { paddingTop: '0', paddingRight: 8 },
  timeSlotDaily: { height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 11, color: '#666', fontWeight: 500, borderRight: '1px solid #e0e0e0' },
  dayEventsContainer: { position: 'relative' },
  hourCellDaily: { height: '60px', borderBottom: '1px solid #e0e0e0', position: 'relative', padding: 4 },
  eventBlockDaily: { padding: '4px 8px', borderRadius: 4, color: '#fff', fontSize: 10, fontWeight: 600, overflow: 'hidden' },
  eventBlockTitleDaily: { margin: '0 0 2px', fontSize: 10, fontWeight: 600 },
  eventBlockTimeDaily: { margin: 0, fontSize: 9 },

  // Yearly view styles
  yearlyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
  miniCalendar: { background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: 8, padding: 10 },
  miniMonthName: { width: '100%', margin: 0, padding: '6px', fontSize: 12, fontWeight: 700, color: '#0D5C6E', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center', marginBottom: 6 },
  miniDayHeaders: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 5 },
  miniDayHeader: { fontSize: 9, fontWeight: 600, color: '#666', textAlign: 'center' },
  miniCalendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 },
  miniDay: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 500, color: '#333', background: '#fff', border: '0.5px solid #e0e0e0', borderRadius: 3, position: 'relative' },
  miniEventDot: { width: 3, height: 3, borderRadius: '50%', marginTop: 1 },
  miniHoverPreview: { position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 9, whiteSpace: 'nowrap', zIndex: 10 },

  hoverPreview: { position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '8px 12px', borderRadius: 6, fontSize: 11, zIndex: 10, minWidth: '150px' },

  fullMonthView: { background: '#f9f9f9', padding: 20, borderRadius: 12 },
  backBtn: { padding: '8px 12px', fontSize: 12, background: '#0D5C6E', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: FONT, marginBottom: 16 },
  fullMonthTitle: { margin: '0 0 16px', fontSize: 22, fontWeight: 700, color: '#333', textAlign: 'center' },
  dayHeadersLarge: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 12, textAlign: 'center' },
  dayHeaderLarge: { fontSize: 13, fontWeight: 700, color: '#666' },
  calendarGridLarge: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 },
  calendarDayLarge: { aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'relative', minHeight: 80, fontSize: 15, fontWeight: 600, background: '#fff', border: '0.5px solid #e0e0e0' },
  eventDotLarge: { width: 8, height: 8, borderRadius: '50%', marginTop: 4 },

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