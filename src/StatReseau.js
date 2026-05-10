import React from 'react';
import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;
  const totalArrets = lignes.reduce((acc, ligne) => acc + ligne.arrets, 0);
  const lignePlusLongue = lignes.reduce((prev, current) => 
    (prev.arrets > current.arrets) ? prev : current,
    lignes[0]
  );

  return (
    <div className="stat-reseau">
      <h2 className="stat-titre">Statistiques du Réseau</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Lignes</span>
          <span className="stat-valeur">{totalLignes}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Arrêts</span>
          <span className="stat-valeur">{totalArrets}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Ligne la plus dense</span>
          <span className="stat-valeur">Ligne {lignePlusLongue?.numero}</span>
          <span className="stat-detail">({lignePlusLongue?.arrets} arrêts)</span>
        </div>
      </div>
    </div>
  );
}

export default StatReseau;