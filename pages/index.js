import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('emi');

  return (
    <div className={styles.container}>
      <Head>
        <title>SetupAI - Free Financial Calculators for Indians</title>
        <meta name="description" content="Free EMI, SIP, and Compound Interest calculators for all Indians" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>SetupAI</h1>
          <p>Free Financial Tools for Every Indian</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.nav}>
        <button
          className={`${styles.tabButton} ${activeTab === 'emi' ? styles.active : ''}`}
          onClick={() => setActiveTab('emi')}
        >
          EMI Calculator
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'sip' ? styles.active : ''}`}
          onClick={() => setActiveTab('sip')}
        >
          SIP Calculator
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'compound' ? styles.active : ''}`}
          onClick={() => setActiveTab('compound')}
        >
          Compound Interest
        </button>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Left Ad Space */}
        <div className={styles.adSpace}>
          <p style={{fontSize: '12px', color: '#999'}}>Ad Space 1</p>
        </div>

        {/* Calculator Content */}
        <div className={styles.calculatorContainer}>
          {activeTab === 'emi' && <EMICalculator />}
          {activeTab === 'sip' && <SIPCalculator />}
          {activeTab === 'compound' && <CompoundInterestCalculator />}
        </div>

        {/* Right Ad Space */}
        <div className={styles.adSpace}>
          <p style={{fontSize: '12px', color: '#999'}}>Ad Space 2</p>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>&copy; 2024 SetupAI. All calculators are free and open to all Indians.</p>
        <div className={styles.footerLinks}>
          <a href="#about">About</a> | 
          <a href="#contact">Contact</a> | 
          <a href="#privacy">Privacy</a>
        </div>
      </footer>
    </div>
  );
}

// EMI Calculator Component
function EMICalculator() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7);
  const [tenure, setTenure] = useState(5);

  const calculateEMI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure) * 12;
    
    if (r === 0) return p / n;
    
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return emi;
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - principal;

  return (
    <div className={styles.calculator}>
      <h2>🏦 EMI Calculator</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Calculate your monthly EMI for loans</p>

      <div className={styles.inputGroup}>
        <label>Loan Amount (₹)</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Enter loan amount"
        />
        <input type="range" min="100000" max="10000000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <span className={styles.value}>₹{parseFloat(principal).toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% per annum)</label>
        <input
          type="number"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="Enter interest rate"
        />
        <input type="range" min="1" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <span className={styles.value}>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Loan Tenure (Years)</label>
        <input
          type="number"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
          placeholder="Enter tenure in years"
        />
        <input type="range" min="1" max="30" value={tenure} onChange={(e) => setTenure(e.target.value)} />
        <span className={styles.value}>{tenure} years</span>
      </div>

      <div className={styles.results}>
        <div className={styles.resultBox}>
          <p>Monthly EMI</p>
          <h3>₹{Math.round(emi).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Total Interest</p>
          <h3>₹{Math.round(totalInterest).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Total Amount to Pay</p>
          <h3>₹{Math.round(totalPayment).toLocaleString('en-IN')}</h3>
        </div>
      </div>
    </div>
  );
}

// SIP Calculator Component
function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(10000);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [years, setYears] = useState(10);

  const calculateSIP = () => {
    const monthly = parseFloat(monthlyAmount);
    const rate = parseFloat(annualReturn) / 100 / 12;
    const months = parseFloat(years) * 12;

    if (rate === 0) return monthly * months;

    const amount = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    return amount;
  };

  const finalAmount = calculateSIP();
  const invested = monthlyAmount * years * 12;
  const returns = finalAmount - invested;

  return (
    <div className={styles.calculator}>
      <h2>📈 SIP Calculator</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Calculate your Systematic Investment Plan returns</p>

      <div className={styles.inputGroup}>
        <label>Monthly Investment (₹)</label>
        <input
          type="number"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
          placeholder="Enter monthly amount"
        />
        <input type="range" min="1000" max="100000" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} />
        <span className={styles.value}>₹{parseFloat(monthlyAmount).toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Annual Return (%)</label>
        <input
          type="number"
          step="0.5"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
          placeholder="Enter expected return"
        />
        <input type="range" min="1" max="30" step="0.5" value={annualReturn} onChange={(e) => setAnnualReturn(e.target.value)} />
        <span className={styles.value}>{annualReturn}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Investment Period (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="Enter investment period"
        />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} />
        <span className={styles.value}>{years} years</span>
      </div>

      <div className={styles.results}>
        <div className={styles.resultBox}>
          <p>Total Invested</p>
          <h3>₹{Math.round(invested).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Expected Returns</p>
          <h3>₹{Math.round(returns).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Final Amount</p>
          <h3>₹{Math.round(finalAmount).toLocaleString('en-IN')}</h3>
        </div>
      </div>
    </div>
  );
}

// Compound Interest Calculator Component
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState(1); // 1=yearly, 2=half-yearly, 4=quarterly, 12=monthly

  const calculateCompound = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(frequency);
    const t = parseFloat(years);

    const amount = p * Math.pow(1 + r / n, n * t);
    return amount;
  };

  const finalAmount = calculateCompound();
  const interest = finalAmount - principal;

  return (
    <div className={styles.calculator}>
      <h2>💰 Compound Interest Calculator</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Calculate compound interest on your savings</p>

      <div className={styles.inputGroup}>
        <label>Principal Amount (₹)</label>
        <input
          type="number"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Enter principal amount"
        />
        <input type="range" min="10000" max="10000000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
        <span className={styles.value}>₹{parseFloat(principal).toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Annual Interest Rate (%)</label>
        <input
          type="number"
          step="0.1"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          placeholder="Enter interest rate"
        />
        <input type="range" min="0.1" max="20" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        <span className={styles.value}>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Time Period (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="Enter time period"
        />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(e.target.value)} />
        <span className={styles.value}>{years} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Compounding Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="1">Yearly</option>
          <option value="2">Half-Yearly</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
        </select>
      </div>

      <div className={styles.results}>
        <div className={styles.resultBox}>
          <p>Principal</p>
          <h3>₹{Math.round(principal).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Interest Earned</p>
          <h3>₹{Math.round(interest).toLocaleString('en-IN')}</h3>
        </div>
        <div className={styles.resultBox}>
          <p>Final Amount</p>
          <h3>₹{Math.round(finalAmount).toLocaleString('en-IN')}</h3>
        </div>
      </div>
    </div>
  );
}
