import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';

const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";

export default function About() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={s.page}>
      <Head>
        <title>About SetupAI — AI-Powered Market Intelligence</title>
        <meta name="description" content="Learn about SetupAI, our mission to filter market noise and deliver actionable intelligence for Indian traders." />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div className="desktop-nav" style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>About</Link>
          <Link href="/tools" style={s.navLink}>Tools</Link>
          <Link href="/events" style={s.navLink}>Events</Link>
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
              <Link href="/about" style={{ ...s.menuLink, background: '#00A37A', color: '#fff' }}>ℹ️ About</Link>
              <Link href="/tools" style={s.menuLink}>🧰 Tools</Link>
              <Link href="/events" style={s.menuLink}>📅 Events Calendar</Link>
            </div>
          </div>
        </div>
      )}

      <div style={s.container}>
        <main style={s.main}>
          <section style={s.hero}>
            <h1 style={s.heroTitle}>About SetupAI</h1>
            <p style={s.heroSubtitle}>Cutting through market noise. Delivering intelligence that moves your money.</p>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>Our Mission</h2>
            <p style={s.sectionText}>
              SetupAI exists to solve one problem: <strong>information overload</strong>. Every day, thousands of news articles flood Indian financial markets. Most are noise. A few move stocks.
            </p>
            <p style={s.sectionText}>
              We built SetupAI to be your filter. Using AI analysis of live RSS feeds, we surface only the news that matters — tagged with sentiment, risk level, and impact. No fluff. No buy/sell tips. Just intelligence.
            </p>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>How It Works</h2>
            <div style={s.stepGrid}>
              <div style={s.step}>
                <div style={s.stepNumber}>1</div>
                <h3 style={s.stepTitle}>Ingest</h3>
                <p style={s.stepText}>We pull live financial news from RSS feeds (MoneyControl, Livemint, Economic Times) in real-time.</p>
              </div>
              <div style={s.step}>
                <div style={s.stepNumber}>2</div>
                <h3 style={s.stepTitle}>Analyze</h3>
                <p style={s.stepText}>Our AI (powered by Groq's LLaMA 3.3) reads each article and assigns sentiment, confidence, risk level, and sector tags.</p>
              </div>
              <div style={s.step}>
                <div style={s.stepNumber}>3</div>
                <h3 style={s.stepTitle}>Surface</h3>
                <p style={s.stepText}>The filtered, tagged news lands on your screen instantly. Tap any card to read full analysis.</p>
              </div>
            </div>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>What We Are</h2>
            <ul style={s.list}>
              <li>✅ A financial news aggregator with AI filtering</li>
              <li>✅ Real-time sentiment analysis for Indian stocks & sectors</li>
              <li>✅ A confidence and risk rating system</li>
              <li>✅ Designed for traders who want an edge</li>
              <li>✅ Built for speed — what matters surfaces fast</li>
            </ul>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>What We Are NOT</h2>
            <ul style={s.list}>
              <li>❌ An investment advisor</li>
              <li>❌ A portfolio manager</li>
              <li>❌ A source of "buy" or "sell" recommendations</li>
              <li>❌ Financial advice of any kind</li>
              <li>❌ A replacement for your own research</li>
            </ul>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>Our Stack</h2>
            <div style={s.techGrid}>
              <div style={s.techCard}>
                <p style={s.techLabel}>Frontend</p>
                <p style={s.techValue}>Next.js + React</p>
              </div>
              <div style={s.techCard}>
                <p style={s.techLabel}>Database</p>
                <p style={s.techValue}>Turso (SQLite)</p>
              </div>
              <div style={s.techCard}>
                <p style={s.techLabel}>Workflow</p>
                <p style={s.techValue}>n8n Cloud</p>
              </div>
              <div style={s.techCard}>
                <p style={s.techLabel}>AI</p>
                <p style={s.techValue}>Groq (LLaMA 3.3)</p>
              </div>
              <div style={s.techCard}>
                <p style={s.techLabel}>Hosting</p>
                <p style={s.techValue}>Vercel</p>
              </div>
              <div style={s.techCard}>
                <p style={s.techLabel}>RSS Sources</p>
                <p style={s.techValue}>MoneyControl, Livemint, ET</p>
              </div>
            </div>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>Built by</h2>
            <p style={s.sectionText}>
              SetupAI is built by <strong>Nikhil Agarwal</strong>, a CA and fintech enthusiast who believes traders deserve better information tools.
            </p>
          </section>

          <section style={s.section}>
            <h2 style={s.sectionTitle}>Disclaimer</h2>
            <p style={s.sectionText}>
              SetupAI is for educational and informational purposes only. Nothing on this platform is investment advice, a recommendation to buy or sell, or financial guidance. Always do your own research. Your capital is at risk.
            </p>
          </section>
        </main>
      </div>

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
        }
      `}</style>
    </div>
  );
}

const s = {
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh', margin: 0, padding: 0 },
  nav: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { fontSize: 18, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 24 },
  navLink: { fontSize: 13, color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  burger: { display: 'none', background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer', lineHeight: 1 },
  menuOverlay: { position: 'fixed', inset: 0, background: 'rgba(20,15,10,0.45)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' },
  menuPanel: { width: '78%', maxWidth: 320, height: '100%', background: 'linear-gradient(180deg, #FFFDF9 0%, #FAF6EF 100%)', boxShadow: '-10px 0 30px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  menuHeader: { background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  menuClose: { background: 'transparent', border: 'none', color: '#9FE1CB', fontSize: 18, cursor: 'pointer' },
  menuTagline: { fontSize: 11, color: '#0D5C6E', margin: '14px 18px 4px', fontWeight: 500 },
  menuLinks: { padding: '8px 12px 20px', display: 'flex', flexDirection: 'column', gap: 7 },
  menuLink: { display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', borderRadius: 11, background: '#fff', border: '1px solid #ECE4D6', fontSize: 14, color: '#1A2B2E', fontWeight: 600, textDecoration: 'none', fontFamily: FONT, cursor: 'pointer' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '40px 20px' },
  main: {},
  hero: { textAlign: 'center', marginBottom: 60, paddingBottom: 40, borderBottom: '1px solid #E4DCCE' },
  heroTitle: { margin: '0 0 12px', fontSize: 42, fontWeight: 700, color: '#0D5C6E', letterSpacing: -1 },
  heroSubtitle: { margin: 0, fontSize: 18, color: '#666', fontWeight: 500, lineHeight: 1.4 },
  section: { marginBottom: 50 },
  sectionTitle: { margin: '0 0 16px', fontSize: 26, fontWeight: 700, color: '#333', letterSpacing: -0.5 },
  sectionText: { margin: '0 0 12px', fontSize: 15, color: '#555', lineHeight: 1.7 },
  stepGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 24 },
  step: { background: '#fff', border: '1px solid #E4DCCE', borderRadius: 12, padding: 24, textAlign: 'center' },
  stepNumber: { width: 50, height: 50, background: '#0D5C6E', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, margin: '0 auto 12px' },
  stepTitle: { margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#333' },
  stepText: { margin: 0, fontSize: 14, color: '#666', lineHeight: 1.6 },
  list: { margin: 0, paddingLeft: 24 },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 24 },
  techCard: { background: '#fff', border: '1px solid #E4DCCE', borderRadius: 10, padding: 16, textAlign: 'center' },
  techLabel: { margin: '0 0 6px', fontSize: 11, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  techValue: { margin: 0, fontSize: 15, color: '#333', fontWeight: 700 },
  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13, marginTop: 60 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};