import './Statistiques.css';

function StatistiqueLignes() {
  return (
    <div className="stat-card">
      <h2 className="stat-chiffre">10</h2>
      <p className="stat-libelle">Lignes</p>
    </div>
  );
}

function StatistiqueArrets() {
  return (
    <div className="stat-card">
      <h2 className="stat-chiffre">150</h2>
      <p className="stat-libelle">Arrêts</p>
    </div>
  );
}

function StatistiqueBus() {
  return (
    <div className="stat-card">
      <h2 className="stat-chiffre">50</h2>
      <p className="stat-libelle">Bus</p>
    </div>
  );
}

export { StatistiqueLignes, StatistiqueArrets, StatistiqueBus };