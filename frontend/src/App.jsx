import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const handleButtonClick = (val) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('');
  };

  const handleDelete = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleCalculate = async () => {
    if (!expression) return;
    try {
      const response = await fetch('http://localhost:3001/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setResult('Error');
      }
    } catch (error) {
      setResult('Error');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      const validKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', '(', ')', '^'];
      if (validKeys.includes(key)) {
        handleButtonClick(key);
      } else if (key === 'Enter' || key === '=') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleDelete();
      } else if (key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression]);

  const buttons = [
    '(', ')', 'sin(', 'cos(',
    'tan(', 'log(', 'sqrt(', '^',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="calculator-app">
      <div className="calculator">
        <div className="display">
          <div className="expression">{expression || '0'}</div>
          <div className="result">{result !== '' ? `= ${result}` : ''}</div>
        </div>
        <div className="controls">
          <button className="btn clear" onClick={handleClear}>AC</button>
          <button className="btn delete" onClick={handleDelete}>DEL</button>
        </div>
        <div className="keypad">
          {buttons.map((btn, index) => {
            let className = 'btn';
            if (btn === '=') className += ' equal';
            if (['+', '-', '*', '/'].includes(btn)) className += ' operator';
            if (['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', '^'].includes(btn)) className += ' func';
            
            return (
              <button
                key={index}
                className={className}
                onClick={() => btn === '=' ? handleCalculate() : handleButtonClick(btn)}
              >
                {btn}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
