// components/CategoryManager.js
import React, { useState, useEffect } from 'react';
import { loadCategories, addCategory, deleteCategory } from '../utils/categoryStorage';

function CategoryManager({ user }) {
  const [categories, setCategories] = useState({ expense: [], income: [] });
  const [activeTab, setActiveTab] = useState('expense');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');

  // Kategorien laden
  useEffect(() => {
    if (user) {
      const userCategories = loadCategories(user.id);
      setCategories(userCategories);
    }
  }, [user]);

  // Tab wechseln
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Neue Kategorie hinzufügen
  const handleAddCategory = (e) => {
    e.preventDefault();
    setError('');

    // Validierungen
    if (!newCategory.trim()) {
      setError('Bitte geben Sie einen Kategorienamen ein.');
      return;
    }

    // Prüfen, ob die Kategorie bereits existiert
    if (categories[activeTab].includes(newCategory.toLowerCase())) {
      setError('Diese Kategorie existiert bereits.');
      return;
    }

    // Kategorie hinzufügen
    const updatedCategories = addCategory(user.id, activeTab, newCategory.toLowerCase());
    setCategories(updatedCategories);
    setNewCategory('');
  };

  // Kategorie löschen
  const handleDeleteCategory = (categoryName) => {
    const updatedCategories = deleteCategory(user.id, activeTab, categoryName);
    setCategories(updatedCategories);
  };

  return (
    <div className="category-manager">
      <h2>Kategorien verwalten</h2>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'expense' ? 'active' : ''}`}
          onClick={() => handleTabChange('expense')}
        >
          Ausgaben
        </button>
        <button
          className={`tab-button ${activeTab === 'income' ? 'active' : ''}`}
          onClick={() => handleTabChange('income')}
        >
          Einnahmen
        </button>
      </div>

      <div className="category-content">
        <div className="category-list">
          <h3>{activeTab === 'expense' ? 'Ausgaben' : 'Einnahmen'}kategorien</h3>
          
          {categories[activeTab].length === 0 ? (
            <p>Keine Kategorien vorhanden.</p>
          ) : (
            <ul>
              {categories[activeTab].map((category) => (
                <li key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    Löschen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="add-category-form">
          <h3>Neue Kategorie hinzufügen</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleAddCategory}>
            <div className="form-group">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Kategoriename"
              />
              <button type="submit">Hinzufügen</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;