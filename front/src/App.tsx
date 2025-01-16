"use client";

import { useEffect, useState } from "react";
import { Sidebar, Table } from "flowbite-react";
import { HiSearch } from "react-icons/hi";

function App() {
  const [style, setStyle] = useState(""); // Filtre pour le style
  const [carburant, setCarburant] = useState(""); // Filtre pour le carburant
  const [marque, setMarque] = useState(""); // Filtre pour la marque
  const [consommation, setConsommation] = useState(""); // Filtre pour la consommation
  const [cylindres, setCylindres] = useState(""); // Filtre pour le nombre de cylindres
  const [puissance, setPuissance] = useState(""); // Filtre pour la puissance
  const [voitures, setVoitures] = useState([]); // Résultats de recherche
  const [error, setError] = useState(null); // Gestion des erreurs

  // Options dynamiques pour les selects
  const [stylesOptions, setStylesOptions] = useState([]);
  const [marquesOptions, setMarquesOptions] = useState([]);
  const [carburantsOptions, setCarburantsOptions] = useState([]);
  const [cylindresOptions, setCylindresOptions] = useState([]);

  // Fonction de recherche combinée
  const fetchByAllFilters = async () => {
    setError(null); // Réinitialiser les erreurs
    try {
      // Construire dynamiquement les paramètres de la requête
      const filters = {
        style,
        carburant,
        marque,
        consommation,
        cylindres,
        puissance,
      };

      // Exclure les champs vides
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value)
      );

      const response = await fetch(
        `http://localhost:3000/voitures?${queryParams.toString()}`
      );
      const data = await response.json();
      setVoitures(data.results || []);
    } catch (err) {
      setError("Erreur lors de la récupération des données.");
    }
  };

  // Récupérer les options pour les selects
  const fetchStyles = async () => {
    try {
      const response = await fetch("http://localhost:3000/style");
      const data = await response.json();
      setStylesOptions(data.results || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des styles.");
    }
  };

  const fetchMarques = async () => {
    try {
      const response = await fetch("http://localhost:3000/marques");
      const data = await response.json();
      setMarquesOptions(data.results || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des marques.");
    }
  };

  const fetchCarburants = async () => {
    try {
      const response = await fetch("http://localhost:3000/carburant");
      const data = await response.json();
      setCarburantsOptions(data.results || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des carburants.");
    }
  };

  const fetchCylindres = async () => {
    try {
      const response = await fetch("http://localhost:3000/cylindre");
      const data = await response.json();
      setCylindresOptions(data.results || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des cylindres.");
    }
  };

  useEffect(() => {
    fetchStyles();
    fetchMarques();
    fetchCarburants();
    fetchCylindres();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Colonne gauche : Filtres */}
      <div className="bg-gray-300">
        <Sidebar aria-label="Filtres">
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item icon={HiSearch}>
                <h2 className="ml-2 text-lg font-bold">Filtres</h2>
              </Sidebar.Item>
              <div className="p-4 space-y-4">
                {/* Bouton de recherche globale */}
                <button
                  onClick={fetchByAllFilters}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 font-bold"
                >
                  Rechercher
                </button>

                {/* Filtre : Style */}
                <div>
                  <label
                    htmlFor="style"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Style
                  </label>
                  <select
                    id="style"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="">-- Sélectionnez un style --</option>
                    {stylesOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre : Type de carburant */}
                <div>
                  <label
                    htmlFor="carburant"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Type de Carburant
                  </label>
                  <select
                    id="carburant"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={carburant}
                    onChange={(e) => setCarburant(e.target.value)}
                  >
                    <option value="">-- Sélectionnez un type --</option>
                    {carburantsOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre : Marque */}
                <div>
                  <label
                    htmlFor="marque"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Marque
                  </label>
                  <select
                    id="marque"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={marque}
                    onChange={(e) => setMarque(e.target.value)}
                  >
                    <option value="">-- Sélectionnez une marque --</option>
                    {marquesOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre : Consommation */}
                <div>
                  <label
                    htmlFor="consommation"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Consommation (L/100km)
                  </label>
                  <input
                    type="number"
                    id="consommation"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={consommation}
                    onChange={(e) => setConsommation(e.target.value)}
                    placeholder="Ex: 5.5"
                  />
                </div>

                {/* Filtre : Nombre de cylindres */}
                <div>
                  <label
                    htmlFor="cylindres"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nombre de Cylindres
                  </label>
                  <select
                    id="cylindres"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={cylindres}
                    onChange={(e) => setCylindres(e.target.value)}
                  >
                    <option value="">-- Sélectionnez un nombre --</option>
                    {cylindresOptions.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtre : Puissance */}
                <div>
                  <label
                    htmlFor="puissance"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Puissance (CV)
                  </label>
                  <input
                    type="number"
                    id="puissance"
                    className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-500"
                    value={puissance}
                    onChange={(e) => setPuissance(e.target.value)}
                    placeholder="Ex: 150"
                  />
                </div>

                {/* Gestion des erreurs */}
                {error && (
                  <p className="text-red-500 font-medium text-sm">{error}</p>
                )}
              </div>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Colonne droite : Résultats */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Résultats</h1>
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Voiture</Table.HeadCell>
              <Table.HeadCell>Marque</Table.HeadCell>
              <Table.HeadCell>Style</Table.HeadCell>
              <Table.HeadCell>Carburant</Table.HeadCell>
              <Table.HeadCell>Cylindres</Table.HeadCell>
              <Table.HeadCell>Prix</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {voitures.length > 0 ? (
                voitures.map((voiture, index) => (
                  <Table.Row
                    key={index}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  >
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {voiture.voiture}
                    </Table.Cell>
                    <Table.Cell>{voiture.marque}</Table.Cell>
                    <Table.Cell>{voiture.style}</Table.Cell>
                    <Table.Cell>{voiture.carburant}</Table.Cell>
                    <Table.Cell>{voiture.cylindres}</Table.Cell>
                    <Table.Cell>{voiture.prix}</Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} className="text-center text-gray-500">
                    Aucun résultat trouvé.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default App;
