// components/ExpenseChart.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function ExpenseChart({ transactions, user }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartData, setChartData] = useState([]);
  
  // Liste der Monate für den Dropdown
  const months = [
    { value: 0, label: 'Januar' },
    { value: 1, label: 'Februar' },
    { value: 2, label: 'März' },
    { value: 3, label: 'April' },
    { value: 4, label: 'Mai' },
    { value: 5, label: 'Juni' },
    { value: 6, label: 'Juli' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'Oktober' },
    { value: 10, label: 'November' },
    { value: 11, label: 'Dezember' }
  ];
  
  // Farbpalette für das Diagramm
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#a4de6c'];
  
  // Berechnet die Daten für das Kuchendiagramm basierend auf dem ausgewählten Monat
  useEffect(() => {
    if (!transactions || transactions.length === 0) {
      setChartData([]);
      return;
    }
    
    // Filtern der Transaktionen für den ausgewählten Monat/Jahr und nur Ausgaben
    const filteredTransactions = transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === selectedMonth && 
             date.getFullYear() === selectedYear && 
             transaction.amount < 0; // Nur Ausgaben
    });
    
    // Gruppieren nach Kategorie und Summe berechnen
    const categoryTotals = {};
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount); // Absoluter Betrag
      
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });
    
    // Formatieren für das Kuchendiagramm
    const formattedData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: COLORS[index % COLORS.length]
    }));
    
    setChartData(formattedData);
  }, [transactions, selectedMonth, selectedYear]);
  
  // Behandelt die Änderung des Monats
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };
  
  // Behandelt die Änderung des Jahres
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };
  
  // Erstellt eine Liste der Jahre, die in den Transaktionen vorkommen
  const getAvailableYears = () => {
    if (!transactions || transactions.length === 0) return [new Date().getFullYear()];
    
    const years = new Set();
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      years.add(date.getFullYear());
    });
    
    return [...years].sort((a, b) => b - a); // Absteigende Sortierung
  };
  
  // Formatiert den Betrag für die Anzeige
  const formatAmount = (amount) => {
    return amount.toFixed(2) + ' CHF';
  };
  
  return (
    <div className="expense-chart">
      <h2>Ausgabenübersicht</h2>
      
      <div className="chart-filters">
        <div className="filter-group">
          <label>Monat:</label>
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Jahr:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            {getAvailableYears().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatAmount(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="chart-summary">
            <h3>Ausgaben nach Kategorie</h3>
            <ul className="category-list">
              {chartData.map((category, index) => (
                <li key={index} className="category-item">
                  <div className="color-box" style={{ backgroundColor: category.color }}></div>
                  <span className="category-name">{category.name}</span>
                  <span className="category-amount">{formatAmount(category.value)}</span>
                </li>
              ))}
              <li className="category-total">
                <strong>Gesamt: </strong>
                <strong>{formatAmount(chartData.reduce((sum, item) => sum + item.value, 0))}</strong>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>Keine Ausgaben im ausgewählten Zeitraum.</p>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;