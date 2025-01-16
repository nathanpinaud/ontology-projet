const express = require("express");
const bodyParser = require("body-parser");
const rdf = require("rdflib");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// cors allow
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Création du graphe
const g = rdf.graph();

const file = "./ontology";

const fs = require("fs");

const ontologie = fs.readFileSync(file, "utf-8");

// Chargement de l'ontologie (en français)

// Charger les données dans le graphe
rdf.parse(
  ontologie,
  g,
  "http://example.org/ontologies/voiture#",
  "text/turtle"
);

const executeQuery = (query) => {
  return new Promise((resolve, reject) => {
    const results = [];
    g.query(
      rdf.SPARQLToQuery(query, false, g),
      (row) => {
        results.push({
          voiture: row["?voiture"].value.split("#")[1],
          marque: row["?marque"].value.split("#")[1],
        });
      },
      {},
      (err) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });
};

app.get("/style", async (req, res) => {
  const query = `
        PREFIX : <http://example.org/ontologies/voiture#>
        SELECT ?style
        WHERE {
        ?style rdf:type :Style .
        }
    `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push(row["?style"].value.split("#")[1]);
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/carburant", async (req, res) => {
  const query = `
            PREFIX : <http://example.org/ontologies/voiture#>
            SELECT ?carburant
            WHERE {
            ?carburant rdf:type :TypeCarburant .
            }
        `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      console.log(row);
      formattedResults.push(row["?carburant"].value.split("#")[1]);
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/marques", async (req, res) => {
  const query = `
                PREFIX : <http://example.org/ontologies/voiture#>
                SELECT ?marque
                WHERE {
                ?marque rdf:type :Marque .
                }
            `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push(row["?marque"].value.split("#")[1]);
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cylindre
app.get("/cylindre", async (req, res) => {
  const query = `
                    PREFIX : <http://example.org/ontologies/voiture#>
                    SELECT ?cylindre
                    WHERE {
                    ?cylindre rdf:type :Cylindre .
                    }
                `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push(row["?cylindre"].value.split("#")[1]);
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Consommation

app.get("/consommation", async (req, res) => {
  const query = `
                            PREFIX : <http://example.org/ontologies/voiture#>
                            SELECT ?consommation
                            WHERE {
                            ?consommation rdf:type :Consommation .
                            }
                        `;
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      formattedResults.push(row["?consommation"].value.split("#")[1]);
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 2000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// endpoint pour rechercher des voitures par plusieurs critères facultatifs
app.get("/voitures", async (req, res) => {
  const { marque, style, carburant, cylindre, consommation } = req.query;
  console.log("marque", marque);
  console.log("style", style);
  console.log("carburant", carburant);
  console.log("cylindre", cylindre);
  console.log("consommation", consommation);

  let query = `
            PREFIX : <http://example.org/ontologies/voiture#>
            SELECT ?voiture ?marque ?style ?typecarburant ?cylindre ?consommation 
            WHERE {
            ?voiture rdf:type :Voiture .
            ?voiture :aPrix ?prix .
        `;

  marque
    ? (query += `?voiture :produitePar :${marque} .
    `)
    : (query += `?voiture :produitePar ?marque .
    `);

  style
    ? (query += `?voiture :aStyle :${style} .
    `)
    : (query += `?voiture :aStyle ?Style .
    `);
  carburant
    ? (query += `?voiture :aTypeCarburant :${carburant} .
    `)
    : (query += `?voiture :aTypeCarburant ?TypeCarburant .
    `);

  cylindre
    ? (query += `?voiture :aCylindres :${cylindre} .
    `)
    : (query += `?voiture :aCylindres ?Cylindre .
    `);

  consommation
    ? (query += `?voiture :aConsommation :${consommation} .
    `)
    : (query += `?voiture :aConsommation ?Consommation .
    `);

  query += `}`;
  console.log(query);
  try {
    const results = rdf.SPARQLToQuery(query, false, g);
    const formattedResults = [];
    g.query(results, (row) => {
      console.log(row);
      formattedResults.push({
        voiture: row["?voiture"].value.split("#")[1] ?? "",
        marque: row["?marque"] ? row["?marque"].value.split("#")[1] : marque,
        style: row["?style"] ? row["?Style"].value.split("#")[1] : style,
        carburant: row["?TypeCarburant"]
          ? row["?TypeCarburant"].value.split("#")[1]
          : carburant,
        cylindre: row["?Cylindre"] ? row["?Cylindre"].value : cylindre,
        consommation: row["?Consommation"]
          ? row["?Consommation"].value
          : consommation,
        prix: row["?prix"] ? row["?prix"].value : "",
      });
    });
    setTimeout(() => {
      res.json({ results: formattedResults });
    }, 5000);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
