// components/TransactionForm.js
import React, { useState, useEffect } from 'react';
import { loadCategories } from '../utils/categoryStorage';

function TransactionForm({ onAddTransaction, user }) {
  const [categories, setCategories] = useState({ expense: [], income: [] });
  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });
  
  // Kategorien laden, wenn Komponente geladen wird oder User wechselt
  useEffect(() => {
    if (user) {
      const userCategories = loadCategories(user.id);
      setCategories(userCategories);
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.transactionDate) return;
    
    // Betrag als Zahl konvertieren
    const amount = parseFloat(form.amount);
    if (isNaN(amount)) return;
    
    // Für Ausgaben negativen Wert speichern
    const finalAmount = form.type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
    
    // Datumsobjekt erstellen
    const transactionDate = new Date(form.transactionDate);
    
    onAddTransaction({
      ...form,
      amount: finalAmount,
      date: transactionDate.toISOString()
    });
    
    // Formular zurücksetzen
    setForm({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      transactionDate: new Date().toISOString().split('T')[0]
    });
  };
  
  return (
    <div className="transaction-form">
      <h2>Neue Transaktion erfassen</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Typ:
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="expense">Ausgabe</option>
              <option value="income">Einnahme</option>
            </select>
          </label>
        </div>
        
        <div className="form-group">
        <label>
            Betrag (CHF):
            <input
                type="number"
                name="amount"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={handleChange}
                required
            />
            </label>
        </div>
        
        <div className="form-group">
          <label>
            Datum:
            <input
              type="date"
              name="transactionDate"
              value={form.transactionDate}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Kategorie:
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">-- Bitte wählen --</option>
              {categories[form.type]?.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Beschreibung:
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>
        </div>
        
        <button type="submit">Speichern</button>
      </form>
    </div>
  );
}

export default TransactionForm;