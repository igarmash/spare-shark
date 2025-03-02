// utils/categoryStorage.js
const CATEGORY_KEY = 'finance-tracker-categories';

// Standardkategorien, wenn keine benutzerdefinierten vorhanden sind
const DEFAULT_CATEGORIES = {
  expense: [
    'lebensmittel',
    'wohnen',
    'transport',
    'unterhaltung',
    'gesundheit',
    'sonstiges'
  ],
  income: [
    'gehalt',
    'bonus',
    'geschenk',
    'zinsen',
    'sonstiges'
  ]
};

// Kategorien mit Benutzer-ID speichern
export const saveCategories = (categories, userId) => {
  const storageKey = `${CATEGORY_KEY}-${userId}`;
  localStorage.setItem(storageKey, JSON.stringify(categories));
};

// Kategorien für einen bestimmten Benutzer laden
export const loadCategories = (userId) => {
  const storageKey = `${CATEGORY_KEY}-${userId}`;
  const categoriesJson = localStorage.getItem(storageKey);
  
  // Wenn keine gespeicherten Kategorien vorhanden sind, 
  // die Standardkategorien zurückgeben
  if (!categoriesJson) {
    return { ...DEFAULT_CATEGORIES };
  }
  
  return JSON.parse(categoriesJson);
};

// Neue Kategorie hinzufügen
export const addCategory = (userId, type, categoryName) => {
  const categories = loadCategories(userId);
  
  // Prüfen, ob die Kategorie bereits existiert
  if (!categories[type].includes(categoryName)) {
    categories[type].push(categoryName);
    saveCategories(categories, userId);
  }
  
  return categories;
};

// Kategorie löschen
export const deleteCategory = (userId, type, categoryName) => {
  const categories = loadCategories(userId);
  
  // Kategorie aus dem Array entfernen
  categories[type] = categories[type].filter(cat => cat !== categoryName);
  saveCategories(categories, userId);
  
  return categories;
};