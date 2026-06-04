import React, { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [activeTab, setActiveTab] = useState('grid');
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  // All 16 Tools
  const tools = [
    // LOAN TOOLS (Red/Orange)
    { id: 'emi', name: 'EMI Calculator', description: 'Calculate monthly EMI', icon: '🏠', color: '#FF6B6B', category: 'loan' },
    { id: 'personalLoan', name: 'Personal Loan', description: 'Personal loan EMI', icon: '💳', color: '#FF8C42', category: 'loan' },
    { id: 'carLoan', name: 'Car Loan EMI', description: 'Auto loan calculator', icon: '🚗', color: '#FF6B6B', category: 'loan' },
    { id: 'homeLoan', name: 'Home Loan EMI', description: 'Mortgage calculator', icon: '🏘️', color: '#FF8C42', category: 'loan' },
    { id: 'hra', name: 'HRA Calculator', description: 'House Rent Allowance', icon: '💼', color: '#FF6B6B', category: 'loan' },
    
    // SAVINGS TOOLS (Green)
    { id: 'fd', name: 'Fixed Deposit', description: 'Bank FD returns', icon: '🏦', color: '#00D084', category: 'savings' },
    { id: 'rd', name: 'Recurring Deposit', description: 'Monthly savings growth', icon: '📊', color: '#26C485', category: 'savings' },
    { id: 'ppf', name: 'PPF Calculator', description: 'Public Provident Fund', icon: '🛡️', color: '#00D084', category: 'savings' },
    { id: 'inflation', name: 'Inflation Calculator', description: 'Money value over time', icon: '📈', color: '#26C485', category: 'savings' },
    
    // INVESTMENT TOOLS (Blue/Purple)
    { id: 'sip', name: 'SIP Calculator', description: 'Mutual fund SIP returns', icon: '📱', color: '#5E72E4', category: 'investment' },
    { id: 'mf', name: 'Mutual Fund Returns', description: 'Investment returns', icon: '📊', color: '#5E72E4', category: 'investment' },
    { id: 'roi', name: 'ROI Calculator', description: 'Return on investment', icon: '🎯', color: '#6C5CE7', category: 'investment' },
    { id: 'compound', name: 'Compound Interest', description: 'Compound calculation', icon: '🔄', color: '#5E72E4', category: 'investment' },
    
    // PLANNING TOOLS (Teal)
    { id: 'retirement', name: 'Retirement Planner', description: 'Plan retirement corpus', icon: '🎁', color: '#00BCD4', category: 'planning' },
    { id: 'savingsGoal', name: 'Savings Goal', description: 'Achieve savings targets', icon: '🎯', color: '#0097A7', category: 'planning' },
    { id: 'investmentGoal', name: 'Investment Goal', description: 'Investment milestones', icon: '🚀', color: '#00ACC1', category: 'planning' },
    { id: 'fire', name: 'FIRE Calculator', description: 'Financial Independence', icon: '✨', color: '#006064', category: 'planning' },
    { id: 'netWorth', name: 'Net Worth Tracker', description: 'Track total wealth', icon: '👤', color: '#00838F', category: 'planning' },
  ];

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <header className={styles.header}>
        <img src="/logo.png" alt="The Setup Intelligence Logo" style={{height: '80px', marginBottom: '20px'}} />
        <h1>The Setup Intelligence</h1>
        <p>AI-Powered Financial Tools for Smart Investors</p>
      </header>

      {/* GRID VIEW */}
      {activeTab === 'grid' && (
        <div className={styles.gridContainer}>
          <div className={styles.toolsGrid}>
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={styles.toolCard}
                style={{ backgroundColor: tool.color }}
                onClick={() => {
                  setSelectedCalculator(tool.id);
                  setActiveTab('calculator');
                }}
              >
                <div className={styles.toolIcon}>{tool.icon}</div>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CALCULATOR VIEWS */}
      {activeTab === 'calculator' && (
        <div className={styles.calculatorContainer}>
          <button className={styles.backButton} onClick={() => setActiveTab('grid')}>← Back to Tools</button>
          
          {selectedCalculator === 'emi' && <EMICalculator />}
          {selectedCalculator === 'personalLoan' && <PersonalLoanCalculator />}
          {selectedCalculator === 'carLoan' && <CarLoanCalculator />}
          {selectedCalculator === 'homeLoan' && <HomeLoanCalculator />}
          {selectedCalculator === 'hra' && <HRACalculator />}
          {selectedCalculator === 'fd' && <FDCalculator />}
          {selectedCalculator === 'rd' && <RDCalculator />}
          {selectedCalculator === 'ppf' && <PPFCalculator />}
          {selectedCalculator === 'inflation' && <InflationCalculator />}
          {selectedCalculator === 'sip' && <SIPCalculator />}
          {selectedCalculator === 'mf' && <MutualFundCalculator />}
          {selectedCalculator === 'roi' && <ROICalculator />}
          {selectedCalculator === 'compound' && <CompoundCalculator />}
          {selectedCalculator === 'retirement' && <RetirementCalculator />}
          {selectedCalculator === 'savingsGoal' && <SavingsGoalCalculator />}
          {selectedCalculator === 'investmentGoal' && <InvestmentGoalCalculator />}
          {selectedCalculator === 'fire' && <FIRECalculator />}
          {selectedCalculator === 'netWorth' && <NetWorthCalculator />}
        </div>
      )}

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© 2026 The Setup Intelligence. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ============================================
// CALCULATOR COMPONENTS
// ============================================

function EMICalculator() {
  const [loan, setLoan] = useState(500000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(180);

  const r = rate / 100 / 12;
  const emi = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalInterest = emi * months - loan;
  const totalAmount = loan + totalInterest;

  return (
    <div className={styles.calculator}>
      <h2>🏠 EMI Calculator</h2>
      <p>Calculate your monthly loan payment</p>
      
      <div className={styles.inputGroup}>
        <label>Loan Amount (₹)</label>
        <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <span>₹{loan.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="1" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Loan Duration (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="6" max="360" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months ({(months / 12).toFixed(1)} years)</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Monthly EMI</span>
          <strong>₹{emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Interest</span>
          <strong>₹{totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Amount Payable</span>
          <strong>₹{totalAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function PersonalLoanCalculator() {
  const [loan, setLoan] = useState(300000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(60);

  const r = rate / 100 / 12;
  const emi = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalInterest = emi * months - loan;

  return (
    <div className={styles.calculator}>
      <h2>💳 Personal Loan EMI</h2>
      <p>Calculate personal loan installments</p>
      
      <div className={styles.inputGroup}>
        <label>Loan Amount (₹)</label>
        <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <input type="range" min="10000" max="5000000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <span>₹{loan.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="5" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Loan Duration (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="6" max="120" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Monthly EMI</span>
          <strong>₹{emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Interest</span>
          <strong>₹{totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function CarLoanCalculator() {
  const [loan, setLoan] = useState(800000);
  const [rate, setRate] = useState(9);
  const [months, setMonths] = useState(60);

  const r = rate / 100 / 12;
  const emi = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalInterest = emi * months - loan;

  return (
    <div className={styles.calculator}>
      <h2>🚗 Car Loan EMI</h2>
      <p>Calculate auto loan payments</p>
      
      <div className={styles.inputGroup}>
        <label>Car Price (₹)</label>
        <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <input type="range" min="100000" max="5000000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <span>₹{loan.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="5" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Loan Duration (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="12" max="84" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Monthly EMI</span>
          <strong>₹{emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Interest</span>
          <strong>₹{totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function HomeLoanCalculator() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(240);

  const r = rate / 100 / 12;
  const emi = (loan * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalInterest = emi * months - loan;

  return (
    <div className={styles.calculator}>
      <h2>🏘️ Home Loan EMI</h2>
      <p>Calculate mortgage payments</p>
      
      <div className={styles.inputGroup}>
        <label>Loan Amount (₹)</label>
        <input type="number" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <input type="range" min="500000" max="20000000" value={loan} onChange={(e) => setLoan(Number(e.target.value))} />
        <span>₹{loan.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="4" max="12" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Loan Duration (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="60" max="360" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months ({(months / 12).toFixed(1)} years)</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Monthly EMI</span>
          <strong>₹{emi.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Interest</span>
          <strong>₹{totalInterest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function HRACalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hraReceived, setHraReceived] = useState(15000);
  const [rentPaid, setRentPaid] = useState(20000);
  const [cityType, setCityType] = useState('metro');

  const hraRate = cityType === 'metro' ? 0.4 : 0.2;
  const maxExemption = Math.min(
    hraReceived,
    basicSalary * hraRate,
    rentPaid - (basicSalary * 0.1)
  );
  const taxableHRA = hraReceived - maxExemption;
  const monthlySavings = maxExemption;

  return (
    <div className={styles.calculator}>
      <h2>💼 HRA Calculator</h2>
      <p>Calculate House Rent Allowance exemption</p>
      
      <div className={styles.inputGroup}>
        <label>Basic Salary (₹)</label>
        <input type="number" value={basicSalary} onChange={(e) => setBasicSalary(Number(e.target.value))} />
        <span>₹{basicSalary.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>HRA Received (₹)</label>
        <input type="number" value={hraReceived} onChange={(e) => setHraReceived(Number(e.target.value))} />
        <span>₹{hraReceived.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Rent Paid (₹)</label>
        <input type="number" value={rentPaid} onChange={(e) => setRentPaid(Number(e.target.value))} />
        <span>₹{rentPaid.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>City Type</label>
        <select value={cityType} onChange={(e) => setCityType(e.target.value)}>
          <option value="metro">Metro (40%)</option>
          <option value="nonmetro">Non-Metro (20%)</option>
        </select>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>HRA Exempted</span>
          <strong>₹{maxExemption.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Taxable HRA</span>
          <strong>₹{taxableHRA.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Monthly Tax Saving</span>
          <strong>₹{(monthlySavings * 0.3).toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function FDCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [months, setMonths] = useState(12);
  const [frequency, setFrequency] = useState('annual');

  let n = 1;
  if (frequency === 'quarterly') n = 4;
  else if (frequency === 'half-yearly') n = 2;

  const years = months / 12;
  const amount = principal * Math.pow(1 + rate / 100 / n, n * years);
  const interest = amount - principal;

  return (
    <div className={styles.calculator}>
      <h2>🏦 Fixed Deposit Calculator</h2>
      <p>Calculate your FD maturity amount</p>
      
      <div className={styles.inputGroup}>
        <label>Principal Amount (₹)</label>
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        <input type="range" min="10000" max="1000000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        <span>₹{principal.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="3" max="10" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Tenure (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="1" max="120" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months ({years.toFixed(1)} years)</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Compounding Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="annual">Annual</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Maturity Amount</span>
          <strong>₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Interest Earned</span>
          <strong>₹{interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function RDCalculator() {
  const [monthlyDeposit, setMonthlyDeposit] = useState(5000);
  const [rate, setRate] = useState(6);
  const [months, setMonths] = useState(60);

  const monthlyRate = rate / 100 / 12;
  const maturityAmount = monthlyDeposit * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalDeposited = monthlyDeposit * months;
  const interestEarned = maturityAmount - totalDeposited;

  return (
    <div className={styles.calculator}>
      <h2>📊 Recurring Deposit (RD)</h2>
      <p>Calculate your RD maturity amount</p>
      
      <div className={styles.inputGroup}>
        <label>Monthly Deposit (₹)</label>
        <input type="number" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} />
        <input type="range" min="1000" max="100000" step="1000" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} />
        <span>₹{monthlyDeposit.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="3" max="10" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Duration (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="6" max="120" step="6" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months ({(months / 12).toFixed(1)} years)</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Total Deposited</span>
          <strong>₹{totalDeposited.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Interest Earned</span>
          <strong>₹{interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Maturity Amount</span>
          <strong>₹{maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function PPFCalculator() {
  const [annualContribution, setAnnualContribution] = useState(50000);
  const [years, setYears] = useState(15);
  const [rate] = useState(7.1);

  const monthlyRate = rate / 100 / 12;
  const maturityAmount = annualContribution * (((Math.pow(1 + monthlyRate, years * 12) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalInvested = annualContribution * years;
  const interestEarned = maturityAmount - totalInvested;
  const taxBenefit = totalInvested * 0.3; // 30% tax saving estimate

  return (
    <div className={styles.calculator}>
      <h2>🛡️ PPF Calculator</h2>
      <p>Calculate Public Provident Fund returns</p>
      
      <div className={styles.inputGroup}>
        <label>Annual Contribution (₹)</label>
        <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} />
        <input type="range" min="500" max="150000" step="500" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} />
        <span>₹{annualContribution.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Years</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="7" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Total Invested</span>
          <strong>₹{totalInvested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Interest Earned</span>
          <strong>₹{interestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Maturity Amount</span>
          <strong>₹{maturityAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Est. Tax Benefit</span>
          <strong>₹{taxBenefit.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [inflationRate, setInflationRate] = useState(5);

  const futureValue = amount * Math.pow(1 + inflationRate / 100, years);
  const realValue = amount / Math.pow(1 + inflationRate / 100, years);
  const differenceAmount = amount - realValue;

  return (
    <div className={styles.calculator}>
      <h2>📈 Inflation Calculator</h2>
      <p>See how inflation affects money value</p>
      
      <div className={styles.inputGroup}>
        <label>Amount (₹)</label>
        <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <input type="range" min="10000" max="1000000" step="10000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <span>₹{amount.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Years</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Inflation Rate (% p.a.)</label>
        <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
        <input type="range" min="1" max="15" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
        <span>{inflationRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Today's Value</span>
          <strong>₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Future Cost (Nominal)</span>
          <strong>₹{futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Real Value Loss</span>
          <strong>₹{differenceAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);

  const months = years * 12;
  const monthlyRate = returnRate / 100 / 12;
  const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const invested = monthlyAmount * months;
  const gain = futureValue - invested;

  return (
    <div className={styles.calculator}>
      <h2>📱 SIP Calculator</h2>
      <p>Calculate Systematic Investment Plan returns</p>
      
      <div className={styles.inputGroup}>
        <label>Monthly Investment (₹)</label>
        <input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} />
        <input type="range" min="500" max="100000" step="500" value={monthlyAmount} onChange={(e) => setMonthlyAmount(Number(e.target.value))} />
        <span>₹{monthlyAmount.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Investment Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Return (% p.a.)</label>
        <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <input type="range" min="1" max="25" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <span>{returnRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Total Invested</span>
          <strong>₹{invested.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Expected Gain</span>
          <strong>₹{gain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Future Value</span>
          <strong>₹{futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Gain %</span>
          <strong>{((gain / invested) * 100).toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
}

function MutualFundCalculator() {
  const [investment, setInvestment] = useState(100000);
  const [years, setYears] = useState(5);
  const [returnRate, setReturnRate] = useState(12);

  const futureValue = investment * Math.pow(1 + returnRate / 100, years);
  const gain = futureValue - investment;

  return (
    <div className={styles.calculator}>
      <h2>📊 Mutual Fund Returns</h2>
      <p>Calculate lump sum mutual fund returns</p>
      
      <div className={styles.inputGroup}>
        <label>Investment Amount (₹)</label>
        <input type="number" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} />
        <span>₹{investment.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Investment Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="40" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Return (% p.a.)</label>
        <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <input type="range" min="1" max="25" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <span>{returnRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Investment</span>
          <strong>₹{investment.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Expected Gain</span>
          <strong>₹{gain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Future Value</span>
          <strong>₹{futureValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Gain %</span>
          <strong>{((gain / investment) * 100).toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
}

function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [finalValue, setFinalValue] = useState(150000);
  const [years, setYears] = useState(3);

  const gain = finalValue - initialInvestment;
  const roi = ((gain / initialInvestment) * 100);
  const annualizedROI = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;

  return (
    <div className={styles.calculator}>
      <h2>🎯 ROI Calculator</h2>
      <p>Calculate your return on investment</p>
      
      <div className={styles.inputGroup}>
        <label>Initial Investment (₹)</label>
        <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} />
        <span>₹{initialInvestment.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Final Value (₹)</label>
        <input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} />
        <span>₹{finalValue.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Investment Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Profit/Loss</span>
          <strong>₹{gain.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>ROI %</span>
          <strong>{roi.toFixed(2)}%</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Annualized ROI</span>
          <strong>{annualizedROI.toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
}

function CompoundCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState('annual');

  let n = 1;
  if (frequency === 'quarterly') n = 4;
  else if (frequency === 'half-yearly') n = 2;
  else if (frequency === 'monthly') n = 12;

  const amount = principal * Math.pow(1 + rate / 100 / n, n * years);
  const interest = amount - principal;

  return (
    <div className={styles.calculator}>
      <h2>🔄 Compound Interest</h2>
      <p>Calculate compound interest returns</p>
      
      <div className={styles.inputGroup}>
        <label>Principal (₹)</label>
        <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        <input type="range" min="10000" max="1000000" step="10000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        <span>₹{principal.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <input type="range" min="1" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        <span>{rate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Time Period (Years)</label>
        <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <input type="range" min="1" max="50" value={years} onChange={(e) => setYears(Number(e.target.value))} />
        <span>{years} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Compounding Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
          <option value="annual">Annually</option>
          <option value="half-yearly">Half-Yearly</option>
          <option value="quarterly">Quarterly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Principal</span>
          <strong>₹{principal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Compound Interest</span>
          <strong>₹{interest.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Amount</span>
          <strong>₹{amount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflationRate, setInflationRate] = useState(5);
  const [returnRate, setReturnRate] = useState(8);

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = 30;
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const annualExpenseAtRetirement = futureMonthlyExpense * 12;
  const corpusNeeded = annualExpenseAtRetirement * yearsInRetirement / Math.pow(1 + returnRate / 100, yearsInRetirement);
  const monthlyInvestmentNeeded = (corpusNeeded / (Math.pow(1 + returnRate / 100 / 12, yearsToRetirement * 12) - 1)) * (returnRate / 100 / 12);

  return (
    <div className={styles.calculator}>
      <h2>🎁 Retirement Planner</h2>
      <p>Plan your retirement corpus</p>
      
      <div className={styles.inputGroup}>
        <label>Current Age</label>
        <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <input type="range" min="18" max="60" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <span>{currentAge} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Retirement Age</label>
        <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
        <input type="range" min="40" max="75" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
        <span>{retirementAge} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Monthly Expense Today (₹)</label>
        <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(Number(e.target.value))} />
        <span>₹{monthlyExpense.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Inflation Rate (% p.a.)</label>
        <input type="number" step="0.1" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
        <span>{inflationRate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Return (% p.a.)</label>
        <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <span>{returnRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Corpus Needed</span>
          <strong>₹{corpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Monthly Investment Needed</span>
          <strong>₹{monthlyInvestmentNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Years to Retirement</span>
          <strong>{yearsToRetirement} years</strong>
        </div>
      </div>
    </div>
  );
}

function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(500000);
  const [months, setMonths] = useState(36);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [interestRate, setInterestRate] = useState(5);

  const monthlyRate = interestRate / 100 / 12;
  const currentGrowth = currentSavings * Math.pow(1 + monthlyRate, months);
  const remainingGoal = goalAmount - currentGrowth;
  const monthlySavingsNeeded = remainingGoal / months;
  const totalInterestEarned = currentGrowth - currentSavings + (monthlySavingsNeeded * months * interestRate / 100 / 12);

  return (
    <div className={styles.calculator}>
      <h2>🎯 Savings Goal Calculator</h2>
      <p>Plan your savings target</p>
      
      <div className={styles.inputGroup}>
        <label>Goal Amount (₹)</label>
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
        <input type="range" min="10000" max="10000000" step="10000" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
        <span>₹{goalAmount.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Time Frame (Months)</label>
        <input type="number" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <input type="range" min="6" max="120" step="6" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        <span>{months} months ({(months / 12).toFixed(1)} years)</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Current Savings (₹)</label>
        <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
        <span>₹{currentSavings.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Interest Rate (% p.a.)</label>
        <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
        <span>{interestRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Monthly Savings Needed</span>
          <strong>₹{monthlySavingsNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Goal Status</span>
          <strong>{monthlySavingsNeeded > 0 ? 'Achievable' : 'Achieved!'}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Expected Interest</span>
          <strong>₹{totalInterestEarned.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function InvestmentGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [currentAge, setCurrentAge] = useState(25);
  const [goalAge, setGoalAge] = useState(35);
  const [currentInvestment, setCurrentInvestment] = useState(100000);
  const [returnRate, setReturnRate] = useState(12);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);

  const yearsToGoal = goalAge - currentAge;
  const currentGrowth = currentInvestment * Math.pow(1 + returnRate / 100, yearsToGoal);
  const monthlyRate = returnRate / 100 / 12;
  const sipGrowth = monthlyInvestment * (((Math.pow(1 + monthlyRate, yearsToGoal * 12) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalProjected = currentGrowth + sipGrowth;
  const gap = goalAmount - totalProjected;
  const onTrack = gap <= 0;

  return (
    <div className={styles.calculator}>
      <h2>🚀 Investment Goal Calculator</h2>
      <p>Plan your investment milestones</p>
      
      <div className={styles.inputGroup}>
        <label>Goal Amount (₹)</label>
        <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} />
        <span>₹{goalAmount.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Current Age</label>
        <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <span>{currentAge} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Goal Age</label>
        <input type="number" value={goalAge} onChange={(e) => setGoalAge(Number(e.target.value))} />
        <span>{goalAge} years</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Current Investment (₹)</label>
        <input type="number" value={currentInvestment} onChange={(e) => setCurrentInvestment(Number(e.target.value))} />
        <span>₹{currentInvestment.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Monthly Investment (₹)</label>
        <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} />
        <span>₹{monthlyInvestment.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Return (% p.a.)</label>
        <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <span>{returnRate}%</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Years to Goal</span>
          <strong>{yearsToGoal} years</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Projected Amount</span>
          <strong>₹{totalProjected.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Goal Achievement</span>
          <strong>{onTrack ? '✅ On Track!' : `₹${gap.toLocaleString('en-IN', {maximumFractionDigits: 0})} short`}</strong>
        </div>
      </div>
    </div>
  );
}

function FIRECalculator() {
  const [annualExpenses, setAnnualExpenses] = useState(600000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [yearlyInvestment, setYearlyInvestment] = useState(300000);
  const [returnRate, setReturnRate] = useState(10);
  const [currentAge, setCurrentAge] = useState(25);

  const corpusNeeded = annualExpenses * 25; // 4% rule
  const safeSavings = currentSavings;
  let projectedAmount = safeSavings;
  let yearsToFIRE = 0;

  for (let i = 0; i < 60; i++) {
    projectedAmount = projectedAmount * (1 + returnRate / 100) + yearlyInvestment;
    if (projectedAmount >= corpusNeeded) {
      yearsToFIRE = i + 1;
      break;
    }
  }

  const retirementAge = currentAge + yearsToFIRE;

  return (
    <div className={styles.calculator}>
      <h2>✨ FIRE Calculator</h2>
      <p>Plan your Financial Independence</p>
      
      <div className={styles.inputGroup}>
        <label>Annual Expenses (₹)</label>
        <input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} />
        <span>₹{annualExpenses.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Current Savings (₹)</label>
        <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
        <span>₹{currentSavings.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Yearly Investment (₹)</label>
        <input type="number" value={yearlyInvestment} onChange={(e) => setYearlyInvestment(Number(e.target.value))} />
        <span>₹{yearlyInvestment.toLocaleString('en-IN')}</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Expected Return (% p.a.)</label>
        <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} />
        <span>{returnRate}%</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Current Age</label>
        <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
        <span>{currentAge} years</span>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Corpus Needed (4% Rule)</span>
          <strong>₹{corpusNeeded.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Years to FIRE</span>
          <strong>{yearsToFIRE} years</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Retirement Age</span>
          <strong>{retirementAge} years</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Projected Corpus</span>
          <strong>₹{projectedAmount.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
      </div>
    </div>
  );
}

function NetWorthCalculator() {
  const [cash, setCash] = useState(100000);
  const [stocks, setStocks] = useState(200000);
  const [mutualFunds, setMutualFunds] = useState(300000);
  const [realEstate, setRealEstate] = useState(2000000);
  const [otherAssets, setOtherAssets] = useState(100000);
  const [loans, setLoans] = useState(500000);
  const [creditCard, setCreditCard] = useState(20000);
  const [otherDebts, setOtherDebts] = useState(50000);

  const totalAssets = cash + stocks + mutualFunds + realEstate + otherAssets;
  const totalLiabilities = loans + creditCard + otherDebts;
  const netWorth = totalAssets - totalLiabilities;

  const assetBreakdown = {
    Cash: cash,
    Stocks: stocks,
    'Mutual Funds': mutualFunds,
    'Real Estate': realEstate,
    'Other Assets': otherAssets
  };

  return (
    <div className={styles.calculator}>
      <h2>👤 Net Worth Tracker</h2>
      <p>Track your total wealth</p>
      
      <h3>Assets</h3>
      <div className={styles.inputGroup}>
        <label>Cash & Bank Balance (₹)</label>
        <input type="number" value={cash} onChange={(e) => setCash(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Stocks (₹)</label>
        <input type="number" value={stocks} onChange={(e) => setStocks(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Mutual Funds (₹)</label>
        <input type="number" value={mutualFunds} onChange={(e) => setMutualFunds(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Real Estate (₹)</label>
        <input type="number" value={realEstate} onChange={(e) => setRealEstate(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Other Assets (₹)</label>
        <input type="number" value={otherAssets} onChange={(e) => setOtherAssets(Number(e.target.value))} />
      </div>

      <h3>Liabilities</h3>
      <div className={styles.inputGroup}>
        <label>Loans (₹)</label>
        <input type="number" value={loans} onChange={(e) => setLoans(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Credit Card Debt (₹)</label>
        <input type="number" value={creditCard} onChange={(e) => setCreditCard(Number(e.target.value))} />
      </div>

      <div className={styles.inputGroup}>
        <label>Other Debts (₹)</label>
        <input type="number" value={otherDebts} onChange={(e) => setOtherDebts(Number(e.target.value))} />
      </div>

      <div className={styles.resultBox}>
        <div className={styles.resultItem}>
          <span>Total Assets</span>
          <strong>₹{totalAssets.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Total Liabilities</span>
          <strong>₹{totalLiabilities.toLocaleString('en-IN', {maximumFractionDigits: 0})}</strong>
        </div>
        <div className={styles.resultItem}>
          <span>Net Worth</span>
          <strong style={{color: netWorth >= 0 ? '#00D084' : '#FF6B6B'}}>
            ₹{netWorth.toLocaleString('en-IN', {maximumFractionDigits: 0})}
          </strong>
        </div>
        <div className={styles.resultItem}>
          <span>Asset to Liability Ratio</span>
          <strong>{(totalAssets / totalLiabilities).toFixed(2)}:1</strong>
        </div>
      </div>
    </div>
  );
}
