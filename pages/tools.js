import { useState } from 'react';
import Link from 'next/link';

// ---------- helpers ----------
const fmt = (n) => {
  if (isNaN(n) || !isFinite(n)) return '—';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};
const fmtL = (n) => {
  if (isNaN(n) || !isFinite(n)) return '—';
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  return '₹' + Math.round(n).toLocaleString('en-IN');
};

export default function Tools() {
  const [open, setOpen] = useState('emi'); // EMI open by default

  const toggle = (key) => setOpen((cur) => (cur === key ? '' : key));

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={s.nav}>
        <Link href="/" style={s.logo}>setup<span style={{ color: '#00C896' }}>ai</span></Link>
        <div style={s.navLinks}>
          <Link href="/" style={s.navLink}>Home</Link>
          <Link href="/about" style={s.navLink}>About</Link>
          <Link href="/tools" style={{ ...s.navLink, color: '#fff', fontWeight: 700 }}>Tools</Link>
        </div>
      </nav>

      <div style={s.body}>
        <p style={s.eyebrow}>Free Tools</p>
        <h1 style={s.h1}>Finance Calculators</h1>
        <p style={s.sub}>Quick, free tools to plan your money and investments.</p>

        <ToolCard title="🏦 EMI Calculator" k="emi" open={open} toggle={toggle}><EMI /></ToolCard>
        <ToolCard title="🔥 FIRE Calculator" k="fire" open={open} toggle={toggle}><FIRE /></ToolCard>
        <ToolCard title="📈 SIP Calculator" k="sip" open={open} toggle={toggle}><SIP /></ToolCard>
        <ToolCard title="📊 ROI Calculator" k="roi" open={open} toggle={toggle}><ROI /></ToolCard>
        <ToolCard title="💰 Net Worth Tracker" k="networth" open={open} toggle={toggle}><NetWorth /></ToolCard>

        {/* BMI — special bonus card */}
        <div style={s.bmiCard}>
          <div style={s.toolHead} onClick={() => toggle('bmi')}>
            <span style={s.toolTitle}>🧘 BMI Calculator <span style={{ fontSize: 11, color: '#BA7517', fontWeight: 600 }}>· bonus tool</span></span>
            <span style={{ color: '#BA7517' }}>{open === 'bmi' ? '▴' : '▾'}</span>
          </div>
          <div style={s.bmiTip}>
            💡 <strong>Why a finance site?</strong> Because health is wealth — a healthy investor is the best investor. Track your body like you track your portfolio. 💪
          </div>
          {open === 'bmi' && <div style={{ marginTop: 16 }}><BMI /></div>}
        </div>
      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <span>© {new Date().getFullYear()} <span style={{ fontWeight: 700 }}>setup<span style={{ color: '#00C896' }}>ai</span></span> · setupai.in</span>
        <div style={s.footerLinks}>
          <Link href="/" style={s.footerLink}>Home</Link>
          <Link href="/about" style={s.footerLink}>About</Link>
          <Link href="/tools" style={s.footerLink}>Tools</Link>
        </div>
        <p style={s.disclaimer}>
          Calculators are for educational purposes only and provide estimates, not financial advice.
          Always verify with a qualified professional.
        </p>
      </footer>
    </div>
  );
}

// ---------- reusable expandable card ----------
function ToolCard({ title, k, open, toggle, children }) {
  const isOpen = open === k;
  return (
    <div style={s.toolCard}>
      <div style={s.toolHead} onClick={() => toggle(k)}>
        <span style={s.toolTitle}>{title}</span>
        <span style={{ color: '#0D5C6E' }}>{isOpen ? '▴' : '▾'}</span>
      </div>
      {isOpen && <div style={{ marginTop: 16 }}>{children}</div>}
    </div>
  );
}

// ---------- input row ----------
function Field({ label, value, onChange, suffix }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      <div style={s.inputWrap}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={s.input}
        />
        {suffix && <span style={s.suffix}>{suffix}</span>}
      </div>
    </div>
  );
}

function Result({ items }) {
  return (
    <div style={s.result}>
      {items.map((it, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <p style={s.resultLabel}>{it.label}</p>
          <p style={{ ...s.resultValue, color: it.color || '#0D5C6E' }}>{it.value}</p>
        </div>
      ))}
    </div>
  );
}

// ---------- EMI ----------
function EMI() {
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(20);
  const P = parseFloat(amount) || 0;
  const r = (parseFloat(rate) || 0) / 12 / 100;
  const n = (parseFloat(years) || 0) * 12;
  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;
  return (
    <>
      <div style={s.grid3}>
        <Field label="Loan amount" value={amount} onChange={setAmount} suffix="₹" />
        <Field label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        <Field label="Tenure" value={years} onChange={setYears} suffix="yrs" />
      </div>
      <Result items={[
        { label: 'MONTHLY EMI', value: fmt(emi), color: '#0D5C6E' },
        { label: 'TOTAL INTEREST', value: fmtL(interest), color: '#D85A30' },
        { label: 'TOTAL PAYMENT', value: fmtL(total), color: '#00A37A' },
      ]} />
    </>
  );
}

// ---------- FIRE ----------
function FIRE() {
  const [expenses, setExpenses] = useState(50000);
  const [rate, setRate] = useState(4);
  const annual = (parseFloat(expenses) || 0) * 12;
  const corpus = (annual * 100) / (parseFloat(rate) || 1);
  return (
    <>
      <div style={s.grid2}>
        <Field label="Monthly expenses" value={expenses} onChange={setExpenses} suffix="₹" />
        <Field label="Safe withdrawal rate" value={rate} onChange={setRate} suffix="%" />
      </div>
      <Result items={[
        { label: 'ANNUAL EXPENSES', value: fmtL(annual), color: '#0D5C6E' },
        { label: 'FIRE NUMBER', value: fmtL(corpus), color: '#00A37A' },
      ]} />
      <p style={s.note}>Your FIRE number is the corpus needed so that withdrawing your safe rate covers expenses indefinitely.</p>
    </>
  );
}

// ---------- SIP ----------
function SIP() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const P = parseFloat(monthly) || 0;
  const i = (parseFloat(rate) || 0) / 12 / 100;
  const n = (parseFloat(years) || 0) * 12;
  const fv = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const invested = P * n;
  const returns = fv - invested;
  return (
    <>
      <div style={s.grid3}>
        <Field label="Monthly investment" value={monthly} onChange={setMonthly} suffix="₹" />
        <Field label="Expected return" value={rate} onChange={setRate} suffix="%" />
        <Field label="Time period" value={years} onChange={setYears} suffix="yrs" />
      </div>
      <Result items={[
        { label: 'INVESTED', value: fmtL(invested), color: '#1A2B2E' },
        { label: 'RETURNS', value: fmtL(returns), color: '#00A37A' },
        { label: 'TOTAL VALUE', value: fmtL(fv), color: '#0D5C6E' },
      ]} />
    </>
  );
}

// ---------- ROI ----------
function ROI() {
  const [invested, setInvested] = useState(100000);
  const [final, setFinal] = useState(150000);
  const [years, setYears] = useState(3);
  const inv = parseFloat(invested) || 0;
  const fin = parseFloat(final) || 0;
  const yr = parseFloat(years) || 0;
  const roi = inv === 0 ? 0 : ((fin - inv) / inv) * 100;
  const cagr = inv === 0 || yr === 0 ? 0 : (Math.pow(fin / inv, 1 / yr) - 1) * 100;
  return (
    <>
      <div style={s.grid3}>
        <Field label="Amount invested" value={invested} onChange={setInvested} suffix="₹" />
        <Field label="Final value" value={final} onChange={setFinal} suffix="₹" />
        <Field label="Holding period" value={years} onChange={setYears} suffix="yrs" />
      </div>
      <Result items={[
        { label: 'TOTAL ROI', value: roi.toFixed(1) + '%', color: roi >= 0 ? '#00A37A' : '#D85A30' },
        { label: 'CAGR', value: cagr.toFixed(1) + '%', color: '#0D5C6E' },
        { label: 'GAIN', value: fmtL(fin - inv), color: fin - inv >= 0 ? '#00A37A' : '#D85A30' },
      ]} />
    </>
  );
}

// ---------- Net Worth ----------
function NetWorth() {
  const [assets, setAssets] = useState(2000000);
  const [liabilities, setLiabilities] = useState(800000);
  const a = parseFloat(assets) || 0;
  const l = parseFloat(liabilities) || 0;
  const net = a - l;
  return (
    <>
      <div style={s.grid2}>
        <Field label="Total assets" value={assets} onChange={setAssets} suffix="₹" />
        <Field label="Total liabilities" value={liabilities} onChange={setLiabilities} suffix="₹" />
      </div>
      <Result items={[
        { label: 'NET WORTH', value: fmtL(net), color: net >= 0 ? '#00A37A' : '#D85A30' },
      ]} />
      <p style={s.note}>Net worth = everything you own (assets) minus everything you owe (liabilities).</p>
    </>
  );
}

// ---------- BMI ----------
function BMI() {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const h = (parseFloat(height) || 0) / 100;
  const w = parseFloat(weight) || 0;
  const bmi = h === 0 ? 0 : w / (h * h);
  let category = '', color = '#0D5C6E', tip = '';
  if (bmi > 0) {
    if (bmi < 18.5) { category = 'Underweight'; color = '#BA7517'; tip = 'Consider a nutritious, calorie-rich diet. A check-up never hurts.'; }
    else if (bmi < 25) { category = 'Healthy'; color = '#00A37A'; tip = 'Great range! Keep up the balanced diet and regular movement.'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#D85A30'; tip = 'Small, consistent steps — more movement, mindful eating — go a long way.'; }
    else { category = 'Obese'; color = '#D85A30'; tip = 'Worth speaking with a doctor about a healthy, sustainable plan.'; }
  }
  // Ideal weight range for healthy BMI (18.5–24.9)
  const lowW = h > 0 ? 18.5 * h * h : 0;
  const highW = h > 0 ? 24.9 * h * h : 0;
  return (
    <>
      <div style={s.grid2}>
        <Field label="Height" value={height} onChange={setHeight} suffix="cm" />
        <Field label="Weight" value={weight} onChange={setWeight} suffix="kg" />
      </div>
      <Result items={[
        { label: 'YOUR BMI', value: bmi > 0 ? bmi.toFixed(1) : '—', color },
        { label: 'CATEGORY', value: category || '—', color },
        { label: 'IDEAL WEIGHT', value: h > 0 ? `${Math.round(lowW)}–${Math.round(highW)} kg` : '—', color: '#0D5C6E' },
      ]} />
      {tip && <p style={{ ...s.note, color }}>{tip}</p>}
    </>
  );
}

// ---------- styles ----------
const FONT = "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif";
const s = {
  page: { fontFamily: FONT, background: '#FAF6EF', minHeight: '100vh' },
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between',
         padding: '16px 28px', background: 'linear-gradient(135deg, #0D5C6E 0%, #0B3038 100%)' },
  logo: { fontSize: 20, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: -0.5 },
  navLinks: { display: 'flex', gap: 22 },
  navLink: { fontSize: 14, color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },

  body: { maxWidth: 680, margin: '0 auto', padding: '34px 24px 50px' },
  eyebrow: { fontSize: 11, color: '#00A37A', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 8px' },
  h1: { fontSize: 28, fontWeight: 700, color: '#1A2B2E', margin: '0 0 6px', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: '#7A6F5E', margin: '0 0 24px' },

  toolCard: { background: '#fff', border: '1px solid #ECE4D6', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
  bmiCard: { background: 'linear-gradient(135deg, #FFF8EC 0%, #fff 100%)', border: '1px solid #F0D9A8', borderRadius: 14, padding: '16px 20px', marginBottom: 12 },
  toolHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' },
  toolTitle: { fontSize: 16, fontWeight: 700, color: '#1A2B2E' },
  bmiTip: { background: '#FBF1DC', borderRadius: 9, padding: '11px 13px', marginTop: 12, fontSize: 12, color: '#8A6D2E', lineHeight: 1.5 },

  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 },
  label: { fontSize: 11, color: '#7A6F5E', display: 'block', marginBottom: 5, fontWeight: 500 },
  inputWrap: { display: 'flex', alignItems: 'center', background: '#FAF6EF', border: '1px solid #E4DCCE', borderRadius: 8, padding: '0 12px' },
  input: { border: 'none', background: 'transparent', padding: '9px 0', fontSize: 14, color: '#1A2B2E', fontWeight: 600, fontFamily: FONT, width: '100%', outline: 'none' },
  suffix: { fontSize: 12, color: '#A89A82', fontWeight: 600, marginLeft: 6 },

  result: { background: '#ECF7F3', borderRadius: 10, padding: 16, display: 'flex', justifyContent: 'space-around', gap: 10, flexWrap: 'wrap' },
  resultLabel: { fontSize: 10, color: '#7A6F5E', margin: '0 0 4px', fontWeight: 600, letterSpacing: 0.3 },
  resultValue: { fontSize: 17, fontWeight: 700, margin: 0 },
  note: { fontSize: 12, color: '#7A6F5E', margin: '12px 0 0', lineHeight: 1.5, fontStyle: 'italic' },

  footer: { background: '#0D5C6E', color: '#C8E9DF', padding: '28px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 13 },
  footerLinks: { display: 'flex', gap: 20 },
  footerLink: { color: '#9FE1CB', textDecoration: 'none', fontWeight: 500 },
  disclaimer: { fontSize: 11, color: '#7FB8AB', maxWidth: 520, lineHeight: 1.5, margin: '6px 0 0' },
};