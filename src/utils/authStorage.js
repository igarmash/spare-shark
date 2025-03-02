
// utils/authStorage.js
const AUTH_KEY = 'finance-tracker-auth';

// Benutzer im lokalen Speicher speichern
export const saveUser = (user) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

// Benutzer aus dem lokalen Speicher laden
export const getUser = () => {
  const userJson = localStorage.getItem(AUTH_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Benutzer aus dem lokalen Speicher entfernen (Logout)
export const removeUser = () => {
  localStorage.removeItem(AUTH_KEY);
};

// Dummy-Funktionen für Benutzerregistrierung und Login
// In einer realen App würden diese mit einer API kommunizieren
export const registerUser = async (userData) => {
  // Simulieren eines API-Aufrufs
  return new Promise((resolve) => {
    setTimeout(() => {
      // Erstellen eines "Benutzer"-Objekts mit eindeutiger ID
      const user = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        // Passwort würde in einer echten Anwendung nicht gespeichert werden
        createdAt: new Date().toISOString()
      };
      
      // Im lokalen Speicher speichern
      saveUser(user);
      resolve(user);
    }, 500);
  });
};

export const loginUser = async (credentials) => {
  // In einer echten App würde dies eine Anfrage an einen Server senden
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // HINWEIS: Dies ist nur eine Simulation!
      // In einer echten App würden Anmeldedaten gegen die Datenbank geprüft werden
      
      // Simulieren eines erfolgreichen Logins (verwenden Sie echte Benutzer in einer richtigen App)
      if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
        const user = {
          id: '123456',
          username: 'Testbenutzer',
          email: credentials.email
        };
        saveUser(user);
        resolve(user);
      } else {
        reject(new Error('Ungültige E-Mail oder Passwort.'));
      }
    }, 500);
  });
};