
// Angepasste utils/storage.js für benutzerbezogene Daten
const DB_NAME = 'finance-tracker-db';
const STORE_NAME = 'transactions';
const DB_VERSION = 1;

// IndexedDB initialisieren
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Fehler beim Öffnen der Datenbank: ' + event.target.error);
    };
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Index für Benutzer-ID erstellen
        store.createIndex('userId', 'userId', { unique: false });
      }
    };
  });
}

// Transaktionen für einen bestimmten Benutzer laden
export async function loadTransactions(userId) {
  if (!userId) return [];
  
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('userId');
      const request = index.getAll(userId);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject('Fehler beim Laden der Transaktionen: ' + event.target.error);
      };
    });
  } catch (error) {
    console.error('Fehler bei loadTransactions:', error);
    return [];
  }
}

// Transaktionen für einen bestimmten Benutzer speichern
export async function saveTransactions(transactions, userId) {
  if (!userId) return false;
  
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('userId');
    
    // Zuerst alle Transaktionen dieses Benutzers löschen
    const userTransactionsRequest = index.getAllKeys(userId);
    
    return new Promise((resolve, reject) => {
      userTransactionsRequest.onsuccess = () => {
        const keysToDelete = userTransactionsRequest.result;
        
        // Alle alten Transaktionen löschen
        const deletePromises = keysToDelete.map(key => 
          new Promise(resolve => {
            const deleteRequest = store.delete(key);
            deleteRequest.onsuccess = resolve;
          })
        );
        
        Promise.all(deletePromises).then(() => {
          // Dann neue Daten einfügen
          transactions.forEach(item => {
            if (!item.userId) item.userId = userId;
            store.add(item);
          });
          
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = (event) => reject(event.target.error);
        });
      };
      
      userTransactionsRequest.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Fehler bei saveTransactions:', error);
    return false;
  }
}