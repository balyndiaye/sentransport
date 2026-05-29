import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Carte from './Carte';
import Footer from './Footer';

function App() {

  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [ligneSelectionnee, setLigneSelectionnee]
    = useState(null);

  useEffect(() => {
    setChargement(true);
    const url = recherche
    ? `http://localhost:5000/lignes/recherche?q=${encodeURIComponent(recherche)}`
    : "http://localhost:5000/lignes";

      fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(
            "Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }, [recherche]);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(
      recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(
      recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
    // Si la ligne cliquée est déjà sélectionnée, on la referme (on désélectionne)
    if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
      setLigneSelectionnee(null);
    } else {
      // Exercice 3 : Appel à l'endpoint GET /lignes/<id> au clic
      fetch(`http://localhost:5000/lignes/${ligne.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Erreur lors du chargement des détails : " + response.status);
          }
          return response.json();
        })
        .then(data => {
          // On enregistre les données détaillées renvoyées par le serveur
          setLigneSelectionnee(data);
        })
        .catch(error => {
          console.error("Erreur détails ligne:", error);
          alert("Impossible de charger les détails de la ligne.");
        });
    }
  }

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">
            Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est
              lancé (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche
          valeur={recherche}
          onChange={setRecherche} />

        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne
          {lignesFiltrees.length > 1 ? 's' : ''}
          {' '}trouvée
          {lignesFiltrees.length > 1 ? 's' : ''}
        </p>

        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee
              && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {ligneSelectionnee
          && <DetailLigne ligne={ligneSelectionnee} />}
          <Carte />
      </main>
      <Footer />
    </div>
  );
}

export default App;