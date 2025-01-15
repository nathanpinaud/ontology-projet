import React, { useState } from "react";
import "./App.css";

function App() {
  const [style, setStyle] = useState(""); // Filtre pour le style
  const [carburant, setCarburant] = useState(""); // Filtre pour le carburant
  const [voitures, setVoitures] = useState([]); // Résultats de recherche
  const [error, setError] = useState(null); // Gestion des erreurs

  // Fonction pour rechercher les voitures par style
  const fetchByStyle = async () => {
    if (!style) {
      setError("Veuillez sélectionner un style.");
      return;
    }
    setError(null); // Réinitialiser l'erreur
    try {
      const response = await fetch(
        `http://localhost:3000/voitures/style?style=${style}`
      );
      const data = await response.json();
      setVoitures(data.results || []);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
    }
  };

  // Fonction pour rechercher les voitures par type de carburant
  const fetchByCarburant = async () => {
    if (!carburant) {
      setError("Veuillez sélectionner un type de carburant.");
      return;
    }
    setError(null); // Réinitialiser l'erreur
    try {
      const response = await fetch(
        `http://localhost:3000/voitures/carburant?carburant=${carburant}`
      );
      const data = await response.json();
      setVoitures(data.results || []);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
    }
  };

  return (
    <div className="App">
      <h1>Moteur de Recherche de Voitures</h1>

      <div className="filters">
        {/* Filtre pour le style */}
        <div>
          <label htmlFor="style">Style :</label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            <option value="">-- Sélectionnez un style --</option>
            <option value="StyleSport">Sport</option>
            <option value="LigneDroite">Ligne Droite</option>
            <option value="Urbain">Urbain</option>
          </select>
          <button onClick={fetchByStyle}>Rechercher par Style</button>
        </div>

        {/* Filtre pour le type de carburant */}
        <div>
          <label htmlFor="carburant">Type de Carburant :</label>
          <select
            id="carburant"
            value={carburant}
            onChange={(e) => setCarburant(e.target.value)}
          >
            <option value="">-- Sélectionnez un type de carburant --</option>
            <option value="Électrique">Électrique</option>
            <option value="Essence">Essence</option>
          </select>
          <button onClick={fetchByCarburant}>Rechercher par Carburant</button>
        </div>
      </div>

      {/* Gestion des erreurs */}
      {error && <p className="error">{error}</p>}

      {/* Affichage des résultats */}
      <div className="results">
        <h2>Résultats :</h2>
        {voitures.length > 0 ? (
          <ul>
            {voitures.map((voiture, index) => (
              <li key={index}>
                <strong>{voiture.voiture}</strong> - {voiture.marque}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun résultat trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default App;
