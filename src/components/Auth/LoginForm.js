
// components/Auth/LoginForm.js
import React, { useState } from 'react';

function LoginForm({ onLogin, switchToRegister }) {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validierungen
    if (!form.email || !form.password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    // Login durchführen
    onLogin(form);
  };

  return (
    <div className="auth-form">
      <h2>Einloggen</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">Einloggen</button>
      </form>
      
      <p className="auth-switch">
        Noch kein Konto? <button onClick={switchToRegister}>Registrieren</button>
      </p>
    </div>
  );
}

export default LoginForm;