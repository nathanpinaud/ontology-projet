const express = require("express");
const bodyParser = require("body-parser");
const rdf = require("rdflib");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Création du graphe
const g = rdf.graph();

// Chargement de l'ontologie (en français)
const ontologie = `
  @prefix : <http://example.org/ontologies/voiture#> .
  @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
  @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

  :Voiture rdf:type rdfs:Class .
  :Marque rdf:type rdfs:Class .
  :TypeCarburant rdf:type rdfs:Class .
  :Usage rdf:type rdfs:Class .
  :Style rdf:type rdfs:Class .

  :produitePar rdf:type rdf:Property ; rdfs:domain :Voiture ; rdfs:range :Marque .
  :aTypeCarburant rdf:type rdf:Property ; rdfs:domain :Voiture ; rdfs:range :TypeCarburant .
  :estConçuePour rdf:type rdf:Property ; rdfs:domain :Voiture ; rdfs:range :Usage .
  :aStyle rdf:type rdf:Property ; rdfs:domain :Voiture ; rdfs:range :Style .

  :StyleSport rdf:type :Style .
  :LigneDroite rdf:type :Style .
  :Urbain rdf:type :Usage .

  :Tesla rdf:type :Marque .
  :Toyota rdf:type :Marque .
  :Volkswagen rdf:type :Marque .

  :ModelS rdf:type :Voiture ;
    :produitePar :Tesla ;
    :aTypeCarburant :Électrique ;
    :estConçuePour :Urbain ;
    :aStyle :StyleSport .

  :Supra rdf:type :Voiture ;
    :produitePar :Toyota ;
    :aTypeCarburant :Essence ;
    :aStyle :LigneDroite .

  :GolfGTI rdf:type :Voiture ;
    :produitePar :Volkswagen ;
    :aTypeCarburant :Essence ;
    :aStyle :LigneDroite .
`;

// Charger les données dans le graphe
rdf.parse(
  ontologie,
  g,
  "http://example.org/ontologies/voiture#",
  "text/turtle"
);

// Endpoint pour rechercher des voitures par style
app.get("/voitures/style", (req, res) => {
  const style = req.query.style;
  const query = `
    PREFIX : <http://example.org/ontologies/voiture#>
    SELECT ?voiture ?marque
    WHERE {
      ?voiture :aStyle :${style} ;
               :produitePar ?marque .
    }
  `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push({
        voiture: row.voiture.value.split("#")[1],
        marque: row.marque.value.split("#")[1],
      });
    });
    res.json({ results: formattedResults });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint pour rechercher des voitures par type de carburant
app.get("/voitures/carburant", (req, res) => {
  const carburant = req.query.carburant;
  const query = `
    PREFIX : <http://example.org/ontologies/voiture#>
    SELECT ?voiture ?marque
    WHERE {
      ?voiture :aTypeCarburant :${carburant} ;
               :produitePar ?marque .
    }
  `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push({
        voiture: row.voiture.value.split("#")[1],
        marque: row.marque.value.split("#")[1],
      });
    });
    res.json({ results: formattedResults });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
