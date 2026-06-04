.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.headerContent h1 {
  margin: 0;
  font-size: 2.5em;
  font-weight: 700;
}

.headerContent p {
  margin: 10px 0 0 0;
  font-size: 1.1em;
  opacity: 0.95;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  flex-wrap: wrap;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tabButton {
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #333;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tabButton:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.tabButton.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.main {
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.calculatorContainer {
  flex: 1;
  min-width: 0;
}

.adSpace {
  width: 250px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #ccc;
  text-align: center;
  color: #999;
  font-size: 12px;
}

.calculator {
  background: white;
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calculator h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.inputGroup {
  margin-bottom: 25px;
}

.inputGroup label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.inputGroup input[type="number"],
.inputGroup input[type="range"],
.inputGroup select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  margin-bottom: 8px;
  transition: border-color 0.3s ease;
}

.inputGroup input[type="number"]:focus,
.inputGroup input[type="range"]:focus,
.inputGroup select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.inputGroup input[type="range"] {
  padding: 0;
  height: 6px;
  cursor: pointer;
}

.value {
  display: inline-block;
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 600;
  color: #667eea;
  font-size: 14px;
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.resultBox {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.resultBox p {
  margin: 0 0 10px 0;
  font-size: 13px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.resultBox h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.footer {
  background: #222;
  color: white;
  padding: 30px 20px;
  text-align: center;
  margin-top: 40px;
}

.footer p {
  margin: 0 0 15px 0;
  font-size: 14px;
  opacity: 0.9;
}

.footerLinks {
  font-size: 13px;
}

.footerLinks a {
  color: #667eea;
  text-decoration: none;
  margin: 0 10px;
}

.footerLinks a:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main {
    flex-direction: column;
  }

  .adSpace {
    width: 100%;
    height: 80px;
  }

  .calculator {
    padding: 25px;
  }

  .headerContent h1 {
    font-size: 2em;
  }
}

@media (max-width: 768px) {
  .nav {
    padding: 15px;
    gap: 8px;
  }

  .tabButton {
    padding: 10px 15px;
    font-size: 12px;
  }

  .calculator {
    padding: 20px;
  }

  .calculator h2 {
    font-size: 22px;
  }

  .results {
    grid-template-columns: 1fr;
  }

  .resultBox h3 {
    font-size: 20px;
  }

  .headerContent h1 {
    font-size: 1.8em;
  }

  .headerContent p {
    font-size: 0.95em;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 25px 15px;
  }

  .headerContent h1 {
    font-size: 1.5em;
  }

  .main {
    padding: 10px;
    gap: 10px;
  }

  .calculator {
    padding: 15px;
  }

  .calculator h2 {
    font-size: 18px;
  }

  .tabButton {
    flex: 1;
    min-width: 100px;
  }
}
