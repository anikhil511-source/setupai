import Link from 'next/link';

export default function About() {
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Top nav — teal, matches homepage */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>About</Link>
          <Link href="/tools" style={s.navLink}>Tools</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={s.hero}>
        <p style={s.eyebrow}>About SetupAI</p>
        <h1 style={s.heroTitle}>
          Building an AI-powered platform where every market participant can learn, grow, and stay ahead — without the noise.
        </h1>
      </section>

      <div style={s.body}>

        {/* OUR STORY */}
        <section style={s.block}>
          <h2 style={s.h2}>Our Story</h2>
          <p style={s.p}>
            SetupAI was born out of experience — the hard kind. I entered the stock market in 2018,
            full of enthusiasm but short on knowledge. Like many beginners, I made losses — not because
            the markets were unbeatable, but because reliable information was scattered, noisy, and hard
            to make sense of.
          </p>
          <p style={{ ...s.p, marginTop: 14 }}>
            That experience pushed me to go deeper. In 2024, I qualified as a Chartered Accountant, which
            gave me an entirely new lens on markets, numbers, and risk. As my knowledge grew, so did a
            realization: there was still no single, trustworthy place where a curious market participant
            could actually learn and stay informed. Every platform was buried in noise.
          </p>
          <p style={{ ...s.p, marginTop: 14 }}>
            So I decided to build the place I wished I'd had when I started — SetupAI.
          </p>
        </section>

        {/* WHY WE BUILT IT */}
        <section style={s.block}>
          <h2 style={s.h2}>Why We Built It</h2>
          <p style={s.p}>
            Market information today is broken in three ways: it's scattered across dozens of sources,
            drowning in noise and hype, and rarely built with Indian participants in mind. Quality
            insights often sit behind paywalls or jargon.
          </p>
          <p style={{ ...s.p, marginTop: 14 }}>
            SetupAI exists to fix that — to cut through the noise with AI, surface only what genuinely
            matters, and make market knowledge accessible to anyone curious enough to learn. This news
            platform is just the first step toward a complete, AI-powered home for every market participant.
          </p>
        </section>

        {/* ABOUT THE FOUNDER */}
        <section style={s.block}>
          <h2 style={s.h2}>About the Founder</h2>
          <div style={s.founderRow}>
            <div style={s.avatar}>NA</div>
            <div>
              <p style={s.founderName}>CA Nikhil Agarwal</p>
              <p style={s.p}>
                Hi, I'm Nikhil Agarwal — a Chartered Accountant and a market participant who learned the
                hard way. After navigating the markets since 2018 and qualifying as a CA in 2024, I'm
                building SetupAI to give others the clarity, knowledge, and edge I wish I'd had from day one.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section style={{ ...s.block, ...s.contactBlock }}>
          <h2 style={s.h2}>Get in Touch</h2>
          <p style={s.p}>Have a question, idea, or just want to connect? I'd love to hear from you.</p>
          <div style={s.contactItems}>
            <span style={s.contactItem}>📧 thesetupai@gmail.com</span>
            <span style={s.contactItem}>📍 Delhi, India</span>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <span>© {new Date().getFullYear()} SetupAI · setupai.in</span>
        <div style={s.footerLinks}>
          <Link href="/" style={s.footerLink}>Home</Link>
          <Link href="/about" style={s.footerLink}>About</Link>
          <Link href="/tools" style={s.footerLink}>Tools</Link>
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
         padding: '16px 28px', background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)' },
  logo: { fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 22 },
  navLink: { fontSize: 14, color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },

  hero: { padding: '46px 28px 26px', maxWidth: 760, margin: '0 auto' },
  eyebrow: { fontSize: 11, color: '#00A37A', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 12px' },
  heroTitle: { fontSize: 28, fontWeight: 700, color: '#1A2B2E', margin: 0, lineHeight: 1.3, letterSpacing: -0.5 },

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
  contactItem: { fontSize: 14, color: '#0D5C6E', fontWeight: 600 },

  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: '28px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};