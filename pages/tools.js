import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";

export default function Tools() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('EMI');
  const [emi, setEmi] = useState({ principal: 500000, rate: 8, tenure: 12 });
  const [fire, setFire] = useState({ target: 5000000, annualExpense: 600000, returnRate: 10 });
  const [sip, setSip] = useState({ monthlyAmount: 10000, annualReturn: 12, years: 20 });
  const [roi, setRoi] = useState({ principal: 100000, returnAmount: 120000 });
  const [netWorth, setNetWorth] = useState({ assets: 5000000, liabilities: 1000000 });
  const [bmi, setBmi] = useState({ weight: 70, height: 175 });

  const calculateEmi = () => {
    const P = emi.principal;
    const R = emi.rate / 12 / 100;
    const N = emi.tenure * 12;
    if (R === 0) return (P / N).toFixed(2);
    return ((P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1)).toFixed(2);
  };

  const calculateFire = () => {
    const years = emi.target / (fire.annualExpense * (1 + fire.returnRate / 100));
    return Math.round(years);
  };

  const calculateSip = () => {
    const r = sip.annualReturn / 100 / 12;
    const n = sip.years * 12;
    return (sip.monthlyAmount * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))).toFixed(0);
  };

  const calculateRoi = () => {
    return (((roi.returnAmount - roi.principal) / roi.principal) * 100).toFixed(2);
  };

  const calculateNetWorth = () => {
    return (netWorth.assets - netWorth.liabilities).toFixed(0);
  };

  const calculateBmi = () => {
    const heightInMeter = bmi.height / 100;
    return (bmi.weight / (heightInMeter * heightInMeter)).toFixed(1);
  };

  const getBmiCategory = () => {
    const bmiValue = parseFloat(calculateBmi());
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const tabs = ['EMI', 'FIRE', 'SIP', 'ROI', 'Net Worth', 'BMI'];

  return (
    <div style={s.page}>
      <Head>
        <title>Financial Calculators — SetupAI Tools</title>
        <meta name="description" content="Free financial calculators: EMI, FIRE, SIP, ROI, Net Worth, BMI for Indian investors." />
      </Head>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div className="desktop-nav" style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={s.navLink}>About</Link>
          <Link href="/tools" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>Tools</Link>
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
              <Link href="/about" style={s.menuLink}>ℹ️ About</Link>
              <Link href="/tools" style={{ ...s.menuLink, background: '#00A37A', color: '#fff' }}>🧰 Tools</Link>
              <Link href="/events" style={s.menuLink}>📅 Events Calendar</Link>
            </div>
          </div>
        </div>
      )}

      <div style={s.container}>
        <h1 style={s.pageTitle}>Financial Calculators</h1>
        <p style={s.pageSubtitle}>Quick tools to help you plan your finances</p>

        <div style={s.tabContainer}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...s.tab,
                ...(activeTab === tab ? s.tabActive : s.tabInactive),
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={s.toolBox}>
          {activeTab === 'EMI' && (
            <div>
              <h2 style={s.toolTitle}>💳 EMI Calculator</h2>
              <p style={s.toolDesc}>Calculate your monthly loan EMI</p>
              <InputRow label="Loan Amount (₹)" value={emi.principal} onChange={(val) => setEmi({ ...emi, principal: val })} />
              <InputRow label="Interest Rate (%) p.a." value={emi.rate} onChange={(val) => setEmi({ ...emi, rate: val })} />
              <InputRow label="Loan Tenure (months)" value={emi.tenure} onChange={(val) => setEmi({ ...emi, tenure: val })} />
              <ResultBox label="Monthly EMI" value={`₹${calculateEmi()}`} />
              <ResultBox label="Total Amount Payable" value={`₹${(calculateEmi() * emi.tenure * 12).toFixed(0)}`} />
            </div>
          )}

          {activeTab === 'FIRE' && (
            <div>
              <h2 style={s.toolTitle}>🔥 FIRE Calculator</h2>
              <p style={s.toolDesc}>Years to achieve financial independence</p>
              <InputRow label="Target Corpus (₹)" value={fire.target} onChange={(val) => setFire({ ...fire, target: val })} />
              <InputRow label="Annual Expense (₹)" value={fire.annualExpense} onChange={(val) => setFire({ ...fire, annualExpense: val })} />
              <InputRow label="Expected Return (%) p.a." value={fire.returnRate} onChange={(val) => setFire({ ...fire, returnRate: val })} />
              <ResultBox label="Years to FIRE" value={`${Math.round((fire.target / fire.annualExpense))} years`} />
            </div>
          )}

          {activeTab === 'SIP' && (
            <div>
              <h2 style={s.toolTitle}>📈 SIP Calculator</h2>
              <p style={s.toolDesc}>Future value of your monthly SIP</p>
              <InputRow label="Monthly SIP Amount (₹)" value={sip.monthlyAmount} onChange={(val) => setSip({ ...sip, monthlyAmount: val })} />
              <InputRow label="Expected Annual Return (%)" value={sip.annualReturn} onChange={(val) => setSip({ ...sip, annualReturn: val })} />
              <InputRow label="Investment Period (years)" value={sip.years} onChange={(val) => setSip({ ...sip, years: val })} />
              <ResultBox label="Future Value" value={`₹${calculateSip()}`} />
              <ResultBox label="Total Invested" value={`₹${(sip.monthlyAmount * sip.years * 12).toFixed(0)}`} />
            </div>
          )}

          {activeTab === 'ROI' && (
            <div>
              <h2 style={s.toolTitle}>📊 ROI Calculator</h2>
              <p style={s.toolDesc}>Return on investment percentage</p>
              <InputRow label="Principal Amount (₹)" value={roi.principal} onChange={(val) => setRoi({ ...roi, principal: val })} />
              <InputRow label="Return Amount (₹)" value={roi.returnAmount} onChange={(val) => setRoi({ ...roi, returnAmount: val })} />
              <ResultBox label="ROI (%)" value={`${calculateRoi()}%`} />
            </div>
          )}

          {activeTab === 'Net Worth' && (
            <div>
              <h2 style={s.toolTitle}>💰 Net Worth Calculator</h2>
              <p style={s.toolDesc}>Your total net worth</p>
              <InputRow label="Total Assets (₹)" value={netWorth.assets} onChange={(val) => setNetWorth({ ...netWorth, assets: val })} />
              <InputRow label="Total Liabilities (₹)" value={netWorth.liabilities} onChange={(val) => setNetWorth({ ...netWorth, liabilities: val })} />
              <ResultBox label="Net Worth" value={`₹${calculateNetWorth()}`} />
            </div>
          )}

          {activeTab === 'BMI' && (
            <div>
              <h2 style={s.toolTitle}>🏃 BMI Calculator</h2>
              <p style={s.toolDesc}>Why its here? Because health is wealth — a healthy investor is the best investor. Track your body like you track your portfolio. 💪</p>
              <InputRow label="Weight (kg)" value={bmi.weight} onChange={(val) => setBmi({ ...bmi, weight: val })} />
              <InputRow label="Height (cm)" value={bmi.height} onChange={(val) => setBmi({ ...bmi, height: val })} />
              <ResultBox label="BMI" value={calculateBmi()} />
              <ResultBox label="Category" value={getBmiCategory()} />
            </div>
          )}
        </div>

        <div style={s.disclaimerBox}>
          <p style={s.disclaimerText}>
            ⚠️ <strong>Disclaimer:</strong> These calculators are for educational purposes only. They use simplified formulas and assumptions. Always consult a financial advisor for personalized advice.
          </p>
        </div>
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

function InputRow({ label, value, onChange }) {
  return (
    <div style={s.inputRow}>
      <label style={s.inputLabel}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} style={s.inputField} />
    </div>
  );
}

function ResultBox({ label, value }) {
  return (
    <div style={s.resultBox}>
      <p style={s.resultLabel}>{label}</p>
      <p style={s.resultValue}>{value}</p>
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
  container: { maxWidth: 900, margin: '0 auto', padding: '40px 20px 60px' },
  pageTitle: { margin: '0 0 8px', fontSize: 36, fontWeight: 700, color: '#333', letterSpacing: -1 },
  pageSubtitle: { margin: '0 0 24px', fontSize: 16, color: '#666', fontWeight: 500 },
  tabContainer: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  tab: { padding: '10px 18px', fontSize: 13, fontWeight: 700, border: '1px solid #E4DCCE', borderRadius: 8, cursor: 'pointer', fontFamily: FONT, transition: 'all 0.2s ease' },
  tabActive: { background: '#0D5C6E', color: '#fff' },
  tabInactive: { background: '#fff', color: '#333' },
  toolBox: { background: '#fff', border: '1px solid #E4DCCE', borderRadius: 12, padding: 32 },
  toolTitle: { margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#333' },
  toolDesc: { margin: '0 0 24px', fontSize: 13, color: '#666', fontWeight: 500 },
  inputRow: { marginBottom: 18 },
  inputLabel: { display: 'block', fontSize: 12, fontWeight: 600, color: '#333', marginBottom: 6 },
  inputField: { width: '100%', padding: '10px 12px', fontSize: 14, border: '1px solid #E4DCCE', borderRadius: 8, fontFamily: FONT, boxSizing: 'border-box' },
  resultBox: { background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 10, padding: 16, marginTop: 12 },
  resultLabel: { margin: '0 0 6px', fontSize: 11, color: '#0D5C6E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 },
  resultValue: { margin: 0, fontSize: 24, fontWeight: 700, color: '#0D5C6E' },
  disclaimerBox: { background: '#FFF3CD', border: '1px solid #FFE69C', borderRadius: 10, padding: 16, marginTop: 32 },
  disclaimerText: { margin: 0, fontSize: 13, color: '#664D03', lineHeight: 1.6 },
  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: 28, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13, marginTop: 60 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};