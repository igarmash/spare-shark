// App.js (überarbeitete Version mit Kategorieverwaltung)
import React, { useState, useEffect } from 'react';
import './App.css';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import AuthContainer from './components/Auth/AuthContainer';
import CategoryManager from './components/CategoryManager';
import ExpenseChart from './components/ExpenseChart';
import { saveTransactions, loadTransactions } from './utils/storage';
import { getUser, saveUser, removeUser, registerUser, loginUser } from './utils/authStorage';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard, form, list, categories, chart
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Beim Start den Benutzer aus dem Speicher laden
  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);
  
  // Beim Start Transaktionen aus dem Speicher laden
  useEffect(() => {
    if (user) {
      const loadSavedTransactions = async () => {
        const savedTransactions = await loadTransactions(user.id);
        if (savedTransactions && savedTransactions.length > 0) {
          setTransactions(savedTransactions);
        }
      };
      
      loadSavedTransactions();
    }
  }, [user]);
  
  // Registrierungsfunktion
  const handleRegister = async (userData) => {
    try {
      setLoading(true);
      const newUser = await registerUser(userData);
      setUser(newUser);
      setLoading(false);
    } catch (error) {
      console.error('Registrierungsfehler:', error);
      setLoading(false);
      // Hier könnten Sie einen Fehler anzeigen
    }
  };
  
  // Login-Funktion
  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const user = await loginUser(credentials);
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error('Login-Fehler:', error);
      setLoading(false);
      // Hier könnten Sie einen Fehler anzeigen
    }
  };
  
  // Logout-Funktion
  const handleLogout = () => {
    removeUser();
    setUser(null);
    setTransactions([]);
    setView('dashboard');
  };
  
  // Neue Transaktion hinzufügen
  const addTransaction = async (transaction) => {
    if (!user) return;
    
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      userId: user.id
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions, user.id);
    
    // Zurück zum Dashboard wechseln
    setView('dashboard');
  };
  
  // Transaktion löschen
  const deleteTransaction = async (id) => {
    if (!user) return;
    
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    await saveTransactions(updatedTransactions, user.id);
  };
  
  if (loading) {
    return <div className="loading">Lädt...</div>;
  }
  
  // Wenn kein Benutzer angemeldet ist, zeige das Auth-Formular
  if (!user) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Spare Shark</h1>
        </header>
        
        <main>
          <AuthContainer 
            onLogin={handleLogin} 
            onRegister={handleRegister} 
          />
        </main>
      </div>
    );
  }
  
  // Wenn ein Benutzer angemeldet ist, zeige die App
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <h1>Spare Shark</h1>
          <div className="user-info">
            <span>Hallo, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">Abmelden</button>
          </div>
        </div>
        <nav>
          <button onClick={() => setView('dashboard')}>Dashboard</button>
          <button onClick={() => setView('form')}>Neue Transaktion</button>
          <button onClick={() => setView('list')}>Alle Transaktionen</button>
          <button onClick={() => setView('categories')}>Kategorien</button>
          <button onClick={() => setView('chart')}>Ausgabendiagramm</button>
        </nav>
      </header>
      
      <main>
        {view === 'dashboard' && (
          <Dashboard transactions={transactions} user={user} />
        )}
        
        {view === 'form' && (
          <TransactionForm 
            onAddTransaction={addTransaction}
            user={user}
          />
        )}
        
        {view === 'list' && (
          <TransactionList 
            transactions={transactions} 
            onDeleteTransaction={deleteTransaction} 
          />
        )}
        
        {view === 'categories' && (
          <CategoryManager user={user} />
        )}

        {view === 'chart' && (
          <ExpenseChart 
            transactions={transactions} 
            user={user} 
          />
        )}
      </main>
    </div>
  );
}

export default App;