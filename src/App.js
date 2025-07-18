import React, { useState, useEffect } from 'react';
import './App.css';
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [initialBalance, setInitialBalance] = useState(() => {
    const saved = localStorage.getItem('initialBalance');
    return saved ? parseFloat(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('initialBalance', initialBalance);
  }, [transactions, initialBalance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !amount) return;
    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      date: new Date().toLocaleString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((item) => item.id !== id));
  };

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = initialBalance + income + expense;

  return (
    <div className="app">
      <h1>Anijay Expense Tracker</h1>

      {/* Initial Balance Input */}
      {transactions.length === 0 && (
        <div className="initial-input">
          <input
            type="number"
            placeholder="Set initial balance (₦)"
            onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
          />
        </div>
      )}

      <h2>Balance: ₦{balance.toFixed(2)}</h2>
      <div className="summary">
        <p className="income"><FaArrowUp /> Income: ₦{income.toFixed(2)}</p>
        <p className="expense"><FaArrowDown /> Expense: ₦{Math.abs(expense).toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter amount (use - for expense)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Add Transaction</button>
      </form>

      {transactions.length === 0 ? (
        <p style={{ marginTop: '20px', fontStyle: 'italic' }}>No transactions yet</p>
      ) : (
        <ul className="transaction-list">
          {transactions.map((t) => (
            <li key={t.id} className={t.amount > 0 ? 'plus' : 'minus'}>
              {t.text} <span>₦{t.amount.toFixed(2)}</span>
              <small>({t.date})</small>
              <button onClick={() => handleDelete(t.id)}><FaTrash /></button>
            </li>
          ))}
        </ul>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: '40px', color: '#333', fontSize: '0.8rem' }}>
        <small>Built with 💙 by <strong style={{ color: '#0d47a1' }}>Anijay</strong></small>
      </footer>
    </div>
  );
}

export default App;
