import Link from 'next/link';

export default function About() {
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Top nav */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00A37A' }}>ai</span></Link>
        <div style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={{ ...s.navLink, color: '#0D5C6E', fontWeight: 700 }}>About</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <p style={s.eyebrow}>About SetupAI</p>
        {/* ====== MISSION (one-line) — EDIT THIS ====== */}
        <h1 style={s.heroTitle}>
          [ Your one-line mission goes here — e.g. "Helping Indian traders catch the news that moves markets." ]
        </h1>
      </section>

      <div style={s.body}>

        {/* ====== OUR STORY ====== */}
        <section style={s.block}>
          <h2 style={s.h2}>Our Story</h2>
          <p style={s.p}>
            [ Write your "our story" here — how SetupAI started, what problem you saw, the journey so far.
            Replace this whole paragraph with your own words. You can write as much as you like. ]
          </p>
        </section>

        {/* ====== WHY WE BUILT IT ====== */}
        <section style={s.block}>
          <h2 style={s.h2}>Why We Built It</h2>
          <p style={s.p}>
            [ Explain the "why" — the gap in the market, what frustrated you, what you wanted to give traders
            and investors. Replace this with your text. ]
          </p>
        </section>

        {/* ====== ABOUT THE FOUNDER ====== */}
        <section style={s.block}>
          <h2 style={s.h2}>About the Founder</h2>
          <div style={s.founderRow}>
            <div style={s.avatar}>NA</div>
            <div>
              <p style={s.founderName}>CA Nikhil Agarwal</p>
              <p style={s.p}>
                [ Write your background here — your experience, qualifications, what drives you.
                Replace this with your own words. ]
              </p>
            </div>
          </div>
        </section>

        {/* ====== CONTACT ====== */}
        <section style={{ ...s.block, ...s.contactBlock }}>
          <h2 style={s.h2}>Get in Touch</h2>
          <p style={s.p}>
            [ Add your contact details — email, social handles, etc. ]
          </p>
          <div style={s.contactItems}>
            <span style={s.contactItem}>📧 [ your-email@example.com ]</span>
            <span style={s.contactItem}>🔗 [ your social / website links ]</span>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <span>© {new Date().getFullYear()} SetupAI · setupai.in</span>
        <div style={s.footerLinks}>
          <Link href="/" style={s.footerLink}>Home</Link>
          <Link href="/about" style={s.footerLink}>About</Link>
        </div>
        <p style={s.disclaimer}>
          SetupAI provides financial news and information for educational purposes only.
          Nothing here is investment advice. Always do your own research.
        </p>
      </footer>
    </div>
  );
}

const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
const s = {
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh' },

  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
         padding: '18px 28px', borderBottom: '1px solid #ECE4D6', background: '#FFFDF9' },
  logo: { fontSize: 20, fontWeight: 700, color: '#1A2B2E', textDecoration: 'none', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 22 },
  navLink: { fontSize: 14, color: '#5C5347', textDecoration: 'none', fontWeight: 500 },

  hero: { padding: '50px 28px 30px', maxWidth: 760, margin: '0 auto' },
  eyebrow: { fontSize: 11, color: '#00A37A', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 12px' },
  heroTitle: { fontSize: 30, fontWeight: 700, color: '#1A2B2E', margin: 0, lineHeight: 1.25, letterSpacing: -0.5 },

  body: { maxWidth: 760, margin: '0 auto', padding: '10px 28px 40px' },
  block: { marginBottom: 36 },
  h2: { fontSize: 20, fontWeight: 700, color: '#0D5C6E', margin: '0 0 12px', letterSpacing: -0.3 },
  p: { fontSize: 15, color: '#4A4236', lineHeight: 1.7, margin: 0 },

  founderRow: { display: 'flex', gap: 16, alignItems: 'flex-start' },
  avatar: { width: 56, height: 56, borderRadius: '50%', background: '#0D5C6E', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
            fontSize: 18, flexShrink: 0 },
  founderName: { fontSize: 16, fontWeight: 700, color: '#1A2B2E', margin: '0 0 6px' },

  contactBlock: { background: '#FFFDF9', border: '1px solid #ECE4D6', borderRadius: 14, padding: 24 },
  contactItems: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 },
  contactItem: { fontSize: 14, color: '#0D5C6E', fontWeight: 500 },

  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: '28px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};